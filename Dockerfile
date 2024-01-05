# Stage 1: Build Node.js application
FROM node:18-alpine AS node-builder

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Stage 2: Build MongoDB
FROM mongo:6-alpine

# Set MongoDB environment variables
ENV MONGO_INITDB_ROOT_USERNAME hotline-erro
ENV MONGO_INITDB_ROOT_PASSWORD hotlinesedati101
ENV MONGO_INITDB_DATABASE mini-ho-development

COPY ./init-mongo.js /docker-entrypoint-initdb.d/

# Stage 3: Combine Node.js and MongoDB
FROM node:18

WORKDIR /app

ARG NODE_ENV=development
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]