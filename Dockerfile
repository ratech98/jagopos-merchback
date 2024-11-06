# Step 1: Define the base image to use (Node.js in this case)
FROM node:16-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if present) to optimize caching
COPY package*.json ./

# Step 4: Install the dependencies for the Node.js app
RUN npm install

# Step 5: Copy the entire application files into the working directory
COPY . .

# Step 6: If you need to run any build command (for example, if it's a React app or has a build step)
RUN npm run build

# Step 7: Define the runtime image (for example, Node.js in the final image)
FROM node:16-alpine

# Step 8: Set the working directory again for the runtime container
WORKDIR /app

# Step 9: Copy the necessary files from the build stage to the runtime stage
COPY --from=build /app /app

# Step 10: Expose the port the app will run on
EXPOSE 8080

# Step 11: Command to run the application
CMD ["npm", "start"]

