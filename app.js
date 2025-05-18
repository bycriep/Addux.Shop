const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const PRODUCTS_PATH = path.join(__dirname, 'js', 'data', 'products.json');
const COUPONS_PATH = path.join(__dirname, 'js', 'data', 'coupons.json');
const EVENTS_PATH = path.join(__dirname, 'js', 'data', 'events.json');

// Crear carpeta IMAGES si no existe
const imagesDir = path.join(__dirname, 'IMAGES');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Subida de archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'IMAGES/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo.' });
  res.json({ path: `IMAGES/${req.file.filename}` });
});

// Productos
app.get('/api/products', (req, res) => {
  fs.readFile(PRODUCTS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo productos.json' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/products', (req, res) => {
  fs.writeFile(PRODUCTS_PATH, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Error guardando productos.json' });
    res.json({ success: true });
  });
});

// Cupones
app.get('/api/coupons', (req, res) => {
  fs.readFile(COUPONS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo coupons.json' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/coupons', (req, res) => {
  fs.writeFile(COUPONS_PATH, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Error guardando coupons.json' });
    res.json({ success: true });
  });
});

// Eventos / Ofertas
app.get('/api/events', (req, res) => {
  fs.readFile(EVENTS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo events.json' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/events', (req, res) => {
  fs.writeFile(EVENTS_PATH, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Error guardando events.json' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
