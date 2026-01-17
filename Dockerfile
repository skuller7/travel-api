FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

# Copy source code
COPY src ./src


COPY src/public ./public


RUN npm run build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application using compiled CommonJS code (npm start -> node dist/server.js)
# Environment variables should be passed at runtime via:
#   docker run -e MONGO_URI=... -e PORT=3000 ...
#   or via EC2 environment variables / AWS Systems Manager Parameter Store
CMD ["npm", "start"]
