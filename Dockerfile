FROM node:22.8.0-alpine

WORKDIR /usr/src/app

# Copy package files and npmrc
COPY package*.json .npmrc ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]