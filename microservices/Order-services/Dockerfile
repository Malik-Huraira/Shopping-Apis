# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /server

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else into the container
COPY . .

# Use development env (can be switched in compose)
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Expose the port your service runs on
EXPOSE 5003

# Start the app
CMD ["npx", "nodemon", "server.js"]
