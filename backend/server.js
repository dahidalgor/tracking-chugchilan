const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Ruta para servir archivos JavaScript desde 'frontend/controllers'
app.use('/controllers', express.static(path.join(__dirname, '..', 'frontend', 'controllers')));

// Configuración de carpeta de uploads
const uploadFolder = path.join(__dirname, '..', 'frontend', 'data', 'img', 'Guias');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    let filename = file.originalname;
    let counter = 1;

    // Verificar si el archivo ya existe y crear un nombre único
    while (fs.existsSync(path.join(uploadFolder, filename))) {
      filename = `${name}_${counter}${ext}`;
      counter++;
    }
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Rutas para servir archivos estáticos
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login.html'));
});

// Ruta para servir archivos de data
app.use('/data', express.static(path.join(__dirname, '..', 'frontend', 'data')));

// Ruta para servir imágenes de guías
app.use('/images/guides', express.static(path.join(__dirname, '..', 'frontend', 'data', 'img', 'Guias')));

// ENDPOINTS DE GUÍAS

// GET - Obtener todos los guías
app.get('/api/guides', (req, res) => {
  try {
    const guidesPath = path.join(__dirname, '..', 'frontend', 'data', 'guides', 'guides.json');
    const data = fs.readFileSync(guidesPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error al obtener guías:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo guía
app.post('/api/guides', (req, res) => {
  try {
    const newGuide = req.body;
    const guidesPath = path.join(__dirname, '..', 'frontend', 'data', 'guides', 'guides.json');
    
    const data = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
    
    // Asignar ID automáticamente
    if (data.guides && data.guides.length > 0) {
      newGuide.id = Math.max(...data.guides.map(g => g.id)) + 1;
    } else {
      newGuide.id = 1;
    }
    
    data.guides.push(newGuide);
    
    fs.writeFileSync(guidesPath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, guide: newGuide });
  } catch (error) {
    console.error('Error al crear guía:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar un guía
app.put('/api/guides/:guide_id', (req, res) => {
  try {
    const guideId = parseInt(req.params.guide_id);
    const updatedGuide = req.body;
    const guidesPath = path.join(__dirname, '..', 'frontend', 'data', 'guides', 'guides.json');
    
    const data = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
    
    // Encontrar y actualizar
    const index = data.guides.findIndex(g => g.id === guideId);
    if (index === -1) {
      return res.status(404).json({ error: 'Guía no encontrado' });
    }
    
    updatedGuide.id = guideId;
    data.guides[index] = updatedGuide;
    
    fs.writeFileSync(guidesPath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, guide: updatedGuide });
  } catch (error) {
    console.error('Error al actualizar guía:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar un guía
app.delete('/api/guides/:guide_id', (req, res) => {
  try {
    const guideId = parseInt(req.params.guide_id);
    const guidesPath = path.join(__dirname, '..', 'frontend', 'data', 'guides', 'guides.json');
    
    const data = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
    const initialLength = data.guides.length;
    
    data.guides = data.guides.filter(g => g.id !== guideId);
    
    if (data.guides.length === initialLength) {
      return res.status(404).json({ error: 'Guía no encontrado' });
    }
    
    fs.writeFileSync(guidesPath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar guía:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Subir imagen
app.post('/api/upload-image', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió archivo' });
    }

    // Devolver URL absoluta del servidor backend
    const imageUrl = `http://localhost:${process.env.PORT || 4000}/images/guides/${req.file.filename}`;
    
    console.log(`Imagen guardada en: ${req.file.path}`);
    console.log(`URL devuelta: ${imageUrl}`);

    res.json({
      success: true,
      path: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error en upload-image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
  console.log(`Carpeta de uploads: ${uploadFolder}`);
  console.log(`Carpeta de uploads existe: ${fs.existsSync(uploadFolder)}`);
  console.log(`URL: http://localhost:${PORT}`);
});
