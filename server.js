const express = require('express');
const geojson2stl = require('./'); // Usa tu conversor ya creado
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON en el body
app.use(express.json({ limit: '5mb' }));

// Ruta del endpoint
app.post('/convertir-a-stl', (req, res) => {
  const { geojson, opciones = {} } = req.body;

  if (!geojson) {
    return res.status(400).json({ error: 'Falta el parámetro "geojson"' });
  }

  try {
    const stl = geojson2stl(geojson, opciones);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=modelo.stl');
    res.send(stl);
  } catch (err) {
    console.error('Error al generar STL:', err.message);
    res.status(500).json({ error: 'No se pudo generar el archivo STL' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
