# Running Super-Verse with Docker

Two containers:
- **client**: nginx serving the React build. It also proxies `/superverse`, `/createorjoinuser` and `/socket.io` to the server.
- **server**: Express + Socket.IO on port 5001, which is internal only.

MongoDB is the Atlas cluster in `DATABASE`.

## Prerequisites (both local and EC2)
At the repo root, neither file is committed:
- `.env`: copy `.env.example` and fill in `DATABASE`.
- `serviceAccount.json`: the Firebase Admin service-account key.

## Local

```sh
docker compose up -d --build          # http://localhost:3000
docker compose logs -f server
docker compose down
```

Hot reload (CRA dev server on :3000, nodemon on :5001):

```sh
docker compose -f compose.yml -f compose.dev.yml up --build
```

Seed or reset the character collections (this overwrites them):

```sh
docker compose run --rm server npm run seed
```

## EC2 (prebuilt images, no build on the instance)

**How images get built:** every push to `main` runs `.github/workflows/docker-publish.yml`. It builds both images for linux/amd64 and pushes them to GitHub Container Registry:
- `ghcr.io/excalibur79/superverse-server`
- `ghcr.io/excalibur79/superverse-client`

Each push is tagged `latest` and `sha-<commit>`. You can also run the workflow by hand from the Actions tab.

**What the instance does:** it only pulls and runs those images. A t2.micro is enough: the running stack uses about 50 MB plus the Docker daemon. The React build needs about 1.5 GB, which is why it runs on GitHub, not on the instance.

### One-time setup

1. **Make the images pullable.** The first time the workflow runs, GitHub creates the two packages as private. Either:
   - Make them public: GitHub → your profile → Packages → `superverse-server` / `superverse-client` → Package settings → Change visibility → Public. The repo is public and the images hold no secrets.
   - Or keep them private and log in on the instance (step 5).
2. **Security group:** allow inbound 22 (SSH) and the client port: 80 by default, or whatever `CLIENT_PORT` is set to in `.env` (for example 4000). Open 443 later for HTTPS. Don't attach an Elastic IP: the scheduler Lambdas terminate and recreate the instance, and the start Lambda points the domain's A record at each new IP.
3. **Add swap.** This is a safety net for a 1 GB / free-tier instance:
   ```sh
   sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
   sudo mkswap /swapfile && sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
4. **Install Docker** (Ubuntu; this includes the compose plugin):
   ```sh
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER && newgrp docker
   ```
5. **Log in to ghcr.io** (only if the packages are private). Use a GitHub personal access token with the `read:packages` scope:
   ```sh
   echo <token> | docker login ghcr.io -u Excalibur79 --password-stdin
   ```
6. **Copy the three files the instance needs.** No git clone is required. From your machine:
   ```sh
   ssh ubuntu@<instance-ip> 'mkdir -p /datadrive/superverse'
   scp compose.ec2.yml .env serviceAccount.json ubuntu@<instance-ip>:/datadrive/superverse/
   ```
7. **Start the stack.** nginx is published on `CLIENT_PORT`, which defaults to 80. To serve on another port, add `CLIENT_PORT=4000` to `.env`:
   ```sh
   cd /datadrive/superverse
   docker compose -f compose.ec2.yml pull
   docker compose -f compose.ec2.yml up -d
   ```
   The containers restart automatically after a reboot. Logs are capped at 3 × 10 MB per container.
8. **Allow the instance in Atlas and Firebase:**
   - **Atlas:** Network Access → allow `0.0.0.0/0`. The instance's IP changes on every start, so a fixed entry stops working.
   - **Firebase console:** Authentication → Settings → Authorized domains → add `ankur-saha.in`. Authorized domains don't include a port, so this also covers `:4000`.

### Deploying an update

1. Push to `main` and wait for the "Publish Docker images" workflow to finish.
2. On the instance:
   ```sh
   cd /datadrive/superverse
   docker compose -f compose.ec2.yml pull && docker compose -f compose.ec2.yml up -d
   docker image prune -f
   ```

To roll back, set `IMAGE_TAG=sha-<commit>` in `.env`, then run `pull` and `up -d` again.

**HTTPS:** for a real domain, put a TLS terminator in front of nginx (for example Caddy or certbot) and open 443.
