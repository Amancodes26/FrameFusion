# Stage 1: Install dependencies and build the project
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma client and build the Next.js application
RUN npx prisma generate && npm run build

# Stage 2: Serve the built application
FROM node:18 AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expose the port your app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
