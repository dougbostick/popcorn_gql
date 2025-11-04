# Multi-stage build for React frontend optimized for AWS ECS
FROM node:22.21.1-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_GRAPHQL_ENDPOINT
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_GRAPHQL_ENDPOINT=$VITE_GRAPHQL_ENDPOINT
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]