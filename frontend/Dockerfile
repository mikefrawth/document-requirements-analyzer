# Base image: Debian slim + Node.js 20 (current LTS, required by Next.js 16)
FROM node:20-slim

# All following commands run relative to /app inside the container
WORKDIR /app

# Copy just the dependency manifests first so Docker can cache this layer —
# npm install only reruns if these files actually change
COPY package.json package-lock.json ./
RUN npm install

# Now copy the rest of the frontend source
COPY . .

# Next.js dev server's default port — matches the CORS origin the backend allows
EXPOSE 3000

# Start the Next.js dev server (runs "next dev" via the "dev" script in package.json)
CMD ["npm", "run", "dev"]