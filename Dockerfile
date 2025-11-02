# Multi-stage Dockerfile for full-stack app (build frontend, then run backend)

FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS build-backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./backend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "backend/server.js"]
