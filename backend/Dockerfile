# Base image
FROM node:18-alpine

RUN npm install -g nodemon

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose application port
EXPOSE 9000

# Command to run the application
CMD ["npm", "start"]
