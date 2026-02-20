FROM node:20-bookworm-slim

WORKDIR /app

# 1️⃣ Copy dependency definitions first (for layer caching)
COPY package*.json ./

# 2️⃣ Install dependencies (including devDeps for TypeScript build)
RUN npm ci

# 3️⃣ Copy entire project (this is what was missing)
COPY . .

# 4️⃣ Build TypeScript
RUN npm run build

# 5️⃣ Remove dev dependencies (optional but clean)
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/server.js"]