# Install dependencies and build all packages
FROM node:22.14.0-alpine AS builder
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for all workspaces
RUN npm install

# Generate Prisma client for API
WORKDIR /app/apps/api
RUN npx prisma generate

# Build all apps and packages
WORKDIR /app
RUN npm run build

# --- Production image for API (NestJS) ---
FROM node:22.14.0-alpine AS api
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
WORKDIR /app/apps/api
RUN npm install --omit=dev
CMD ["npm", "run", "start:prod:migrations"]

# --- Production image for Web (Next.js) ---
FROM node:22.14.0-alpine AS web
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
WORKDIR /app/apps/web
RUN npm install --omit=dev
CMD ["npm", "start"]

# --- Final stage: use docker-compose to run both api and web images ---
# See docker-compose.yml for service definitions
