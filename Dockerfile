# Use an official Node.js runtime as a parent image
FROM node:lts-bookworm-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies only
RUN npm install 

# Copy the rest of the code
COPY . .

# Define the command to run the app
# Using CMD instead of RUN for commands that will be run when the container is started
CMD ["npm", "start"]

# Expose port 3000 for the app to be accessible
EXPOSE 3000