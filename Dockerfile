# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create a simple health check script
COPY <<EOF /app/healthcheck.js
const http = require('http');
http.get('http://localhost:3000', (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', () => {
  process.exit(1);
});
EOF

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD node /app/healthcheck.js

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
