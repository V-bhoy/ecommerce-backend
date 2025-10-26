# 1. Use Node.js base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --production

# 4. Copy rest of the code
COPY . .

# 5. Expose backend port
EXPOSE 5000

# 6. Run server
CMD ["npm", "run", "start"]