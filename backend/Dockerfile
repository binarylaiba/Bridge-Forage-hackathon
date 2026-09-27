FROM node:18-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY server.js ./
COPY routes/ ./routes/

# data/ is mounted as a volume so products.json persists across restarts
# (see docker-compose.yml)

EXPOSE 3001

CMD ["node", "server.js"]
