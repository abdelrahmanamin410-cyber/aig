# Image Converter — Fullstack (Local & Docker)

This full-stack project is configured for local development and Docker-based deployment.

## Quick start (local)

1. Install root dev dependencies (concurrently):

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

2. Start both frontend & backend for development:

```bash
npm run dev
```

- Frontend dev server: http://localhost:5173
- Backend API: http://localhost:5000/api/convert

3. Build frontend for production and run backend to serve it:

```bash
npm run build
NODE_ENV=production npm start
```

## Docker (local container)

Build and run locally with Docker (no VPS required):

```bash
# build image
docker build -t image-converter-fullstack .

# run container mapping ports
docker run -p 5000:5000 image-converter-fullstack
```

The Dockerfile builds the frontend and backend into a single container and serves the built frontend from Express.

## Notes
- This setup intentionally avoids any VPS-specific hosting instructions. It targets local and Docker deployment only.
