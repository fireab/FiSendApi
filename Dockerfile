# Use Node.js 18.18.2 LTS
FROM node:18.18.2

WORKDIR /app


# Install dependencies
COPY package.json ./
RUN npm install
RUN npm install --only=dev

# Copy source code
COPY . .

# Expose the application port
EXPOSE ${PORT}

# Start the app (Ensure this starts the application that stays running, e.g., Express)
CMD ["npm", "run", "dev"]
