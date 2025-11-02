# Image Converter — Frontend (Professional)

This is the final polished frontend for the Image Converter app.
Built with React + Vite + Tailwind CSS. Designed to work with the backend API at `VITE_API_URL`.

## Features
- Minimal, clean UI with blue accent
- Drag-and-drop upload area
- Image preview before conversion
- Upload progress and progress bar
- Programmatic download and success toast
- Configurable backend URL via `.env`

## Quick start
1. Install dependencies
```bash
npm install
```
2. Run development server
```bash
npm run dev
```
3. Copy `.env.example` to `.env` and edit `VITE_API_URL` if needed.

## Production
Run `npm run build` to generate a production build.
Serve the `dist/` folder with any static hosting (Vercel, Netlify, S3 + CloudFront, etc.).

