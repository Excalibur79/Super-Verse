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

## EC2

1. **Instance:** Ubuntu 24.04, t3.small or larger. The React build needs about 1.5 GB of RAM. On a t2/t3.micro, add 2 GB of swap first.
2. **Security group:** allow inbound 22 (SSH) and 80 (HTTP), plus 443 if you add HTTPS later.
3. **Elastic IP:** attach one so the address survives restarts.
4. **Install Docker** (this includes compose and buildx):
   ```sh
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER && newgrp docker
   ```
5. **Get the code and the secrets onto the box:**
   ```sh
   git clone https://github.com/Excalibur79/Super-Verse.git && cd Super-Verse
   # from your machine:
   scp .env serviceAccount.json ubuntu@<elastic-ip>:~/Super-Verse/
   ```
   On the instance, set `CLIENT_PORT=80` in `.env`.
6. **Start the stack:**
   ```sh
   docker compose up -d --build
   ```
   The containers restart automatically after a reboot (`restart: unless-stopped`, and Docker starts at boot).
7. **Allow the instance in Atlas and Firebase:**
   - **Atlas:** Network Access → add the Elastic IP.
   - **Firebase console:** Authentication → Settings → Authorized domains → add your domain, or the instance's public DNS name (`ec2-…compute.amazonaws.com`).
8. **Update after pushing new code:**
   ```sh
   git pull && docker compose up -d --build
   ```

**HTTPS:** for a real domain, put a TLS terminator in front of nginx (for example Caddy or certbot) and open 443.
