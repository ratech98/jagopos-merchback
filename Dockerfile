# Step 1: Use a base image for Node.js
FROM node:16-slim AS build-stage

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Step 2: Use a smaller base image for production
FROM node:16-slim

# Set working directory in the container
WORKDIR /app

# Copy built app from build stage
COPY --from=build-stage /app ./

# Expose necessary port (adjust according to your app)
EXPOSE 8080

# Command to start the app
CMD ["npm", "start"]
