FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Hot-reload dev server (used by compose.dev.yml)
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

FROM deps AS build
# No source maps in the public build; also keeps memory low on small EC2 instances
ENV GENERATE_SOURCEMAP=false
COPY . .
RUN npm run build

# Static build served by nginx, which also proxies API and socket traffic to the server
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
