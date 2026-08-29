FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Create uploads directories
RUN mkdir -p public/uploads/events public/uploads/publications public/uploads/gallery

# Expose the backend port
EXPOSE 5000

CMD ["node", "dist/server.js"]