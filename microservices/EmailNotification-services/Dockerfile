# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY . .

# Remove development files
RUN rm -rf .env.development .env.test

# Create logs directory
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5002/health || exit 1

# Expose port
EXPOSE 5002

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
