FROM node:18

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy frontend package files and install dependencies
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy frontend source files and build
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm run build

# Copy the entire app
WORKDIR /app
COPY . .

EXPOSE 5000 3000

CMD ["npm", "start"]