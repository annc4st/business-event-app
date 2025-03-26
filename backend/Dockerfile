# Base image
FROM node:18-alpine

# RUN npm install -g nodemon

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json package-lock.json ./

# Remove Husky "prepare" script before installing dependencies
# RUN sed -i '/"prepare"/d' package.json

# Install dependencies, but prevent Husky from running
RUN npm install --production

# Copy application code
COPY . .

# Expose application port
EXPOSE 9000

# Command to run the application
CMD ["npm", "start"]
