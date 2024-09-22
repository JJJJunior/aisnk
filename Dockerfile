# Install dependencies
FROM node:20.16.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM node:20.16.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20.16.0-alpine AS runner
WORKDIR /app

# Copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Expose the port and start the application
EXPOSE 3000
ENV PORT 3000

# 运行自定义服务器
CMD ["node", "server.js"]