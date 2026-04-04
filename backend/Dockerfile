# 1. Use Node 18 Alpine
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install OpenSSL (Fixes the Prisma 'libssl' warning)
RUN apk add --no-cache openssl

# 4. Copy package files
COPY package*.json ./

# 5. NEW: Copy the prisma folder FIRST 
# This allows 'npm install' to run the 'postinstall' prisma generate script
COPY prisma ./prisma/

# 6. Install all dependencies
RUN npm install

# 7. Copy the rest of the application code
COPY . .

# 8. Build TypeScript to JS
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]