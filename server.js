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
  const { vector_paths, altura_extrusion = 5.0 } = req.body;

  if (!vector_paths) {
    return res.status(400).json({ error: 'Falta el parámetro "vector_paths"' });
  }

  // Construir un objeto GeoJSON compatible a partir de vector_paths
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: vector_paths
        }
      }
    ]
  };

  const opciones = {
    extrude: altura_extrusion
  };

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