# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Required for native Node modules
RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Copy package files first for caching
COPY frontend/package*.json ./

# Reproducible dependency install
RUN npm ci

# Copy source
COPY frontend/ ./

# Build Svelte app
RUN npm run build

# -------------------------------------------------

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app

# dumb-init for signal handling
RUN apt-get update && apt-get install -y dumb-init \
 && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -s /usr/sbin/nologin nodejs

# Copy build artifacts
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Install production deps only
RUN npm ci --omit=dev \
 && npm cache clean --force

USER nodejs

EXPOSE 3000
ENV NODE_ENV=production

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => { r.resume(); r.on('end', () => process.exit(r.statusCode === 200 ? 0 : 1)) }).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
