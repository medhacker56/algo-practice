# Minimal production-ready Node image (alpine)
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Some native libs for potential future needs
RUN apk add --no-cache libc6-compat

# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy the rest of the app
COPY . .

# Build for production if possible
RUN npm run build || true

EXPOSE 3000
CMD ["npm", "start"]
