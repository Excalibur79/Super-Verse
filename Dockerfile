FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY app.js firebase-admin.js ./
COPY Database ./Database
COPY Models ./Models
COPY Routes ./Routes
COPY helpers ./helpers
COPY scripts ./scripts
COPY dataset ./dataset
COPY naruto_dataset ./naruto_dataset

ENV PORT=5001
# The old MongoDB driver triggers a URL deprecation warning that prints the full
# connection string (with password) to the logs, so silence deprecation warnings
ENV NODE_OPTIONS=--no-deprecation
EXPOSE 5001

# serviceAccount.json and .env are provided at runtime by compose, never baked in
CMD ["node", "app.js"]
