import express from 'express';
import multer from 'multer';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_FILE_SIZE = (process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;

// Temporary upload directory
const UPLOAD_DIR = path.join(os.tmpdir(), 'image-converter');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Cleanup old temp files on startup
try {
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    fs.unlinkSync(path.join(UPLOAD_DIR, f));
  }
  console.log('🧹 Temp directory cleaned.');
} catch (err) {
  console.warn('⚠️ Could not clean temp directory:', err.message);
}

// Serve built frontend in production
const CLIENT_BUILD_DIR = path.join(process.cwd(), 'frontend', 'dist');
if (process.env.NODE_ENV === 'production') {
  if (fs.existsSync(CLIENT_BUILD_DIR)) {
    app.use(express.static(CLIENT_BUILD_DIR));
    app.get('/', (req, res) => res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html')));
  } else {
    console.warn('⚠️ Client build not found. Run `npm run build` in frontend before starting in production.');
  }
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Image Converter API is running' });
});

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    const { format } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!format) return res.status(400).json({ error: 'Missing target format' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `converted-${Date.now()}.${format}`);

    await sharp(inputPath).toFormat(format).toFile(outputPath);
    fs.unlinkSync(inputPath);

    res.download(outputPath, err => {
      if (!err) fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Conversion failed', details: err.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Image Converter backend running on http://localhost:${PORT}`);
});
