FROM node:22-slim

# Install dependencies required by Bob Shell
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    util-linux \
    && rm -rf /var/lib/apt/lists/*

# Install IBM Bob Shell and select npm automatically
RUN curl -fsSL https://bob.ibm.com/download/bobshell.sh -o /tmp/bobshell.sh \
    && chmod +x /tmp/bobshell.sh \
    && printf "1\n" | script -q -c "bash /tmp/bobshell.sh" /dev/null \
    && rm -f /tmp/bobshell.sh

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application
COPY . .

# Entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["node", "watch.js"]