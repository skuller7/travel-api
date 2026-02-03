FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json tsconfig.json ./

# Install root dependencies
RUN npm install

# Copy backend source code
COPY src ./src

# Copy frontend source and build it
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Go back to root and build backend
WORKDIR /app
RUN npm run build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
