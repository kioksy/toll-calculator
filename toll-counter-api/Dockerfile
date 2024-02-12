# Use the official Node.js 16 image as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /api

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code to the container
COPY . .

# Build the Prisma client
RUN npx prisma generate

# Your application's default port, adjust if necessary
EXPOSE 3000

# Command to run your app, adjust if necessary
CMD ["npm", "start", "server.js"]