# 🖼️ Image Converter Backend (Final Professional)

A secure and efficient backend for the Image Converter app.

## Features
- Node.js + Express + Sharp
- Auto-cleaning local temp storage
- Secure middleware: Helmet, CORS, file-size limits
- Logging via Morgan
- Environment-based config
- Docker support

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Copy environment file
```bash
cp .env.example .env
```

### 3. Run the server
```bash
npm start
```

Server runs by default on [http://localhost:5000](http://localhost:5000)

### 4. API Endpoint

**POST /api/convert**  
Form data:
- `image`: uploaded image file  
- `format`: desired output format (`png`, `jpg`, `webp`, etc.)

Returns the converted file for download.

### 5. Docker (optional)
```bash
docker build -t image-converter-backend .
docker run -p 5000:5000 image-converter-backend
```

Logs and temporary files are cleaned automatically.
