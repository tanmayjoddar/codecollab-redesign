# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all source files and config
COPY package*.json ./
COPY tsconfig.json vite.config.ts drizzle.config.ts ./
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY migrations ./migrations
COPY types ./types

# Install all dependencies (including devDependencies for build)
RUN npm install

# Build the application (client + server)
RUN npm run build

# Final stage - Runtime
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
