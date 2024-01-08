# Stage 1: Build Node.js application
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm","run", "dev"]