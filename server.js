 1 | const express = require('express');
 2 | const geojson2stl = require('./'); // Usa tu conversor ya creado
 3 | const fs = require('fs');
 4 | const path = require('path');
 5 |
 6 | const app = express();
 7 | const PORT = process.env.PORT || 3000;
 8 |
 9 | // Middleware para leer JSON en el body
10 | app.use(express.json({ limit: '5mb' }));
11 |
12 | // Ruta del endpoint
13 | app.post('/convertir-a-stl', (req, res) => {
14 |   const { vector_paths, altura_extrusion = 5.0 } = req.body;
15 |
16 |   if (!vector_paths || !Array.isArray(vector_paths)) {
17 |     return res.status(400).json({ error: 'Falta o formato inválido en "vector_paths"' });
18 |   }
19 |
20 |   // Construir un objeto GeoJSON compatible a partir de vector_paths
21 |   const geojson = {
22 |     type: 'FeatureCollection',
23 |     features: vector_paths.map(path => ({
24 |       type: 'Feature',
25 |       geometry: {
26 |         type: 'Polygon',
27 |         coordinates: path
28 |       }
29 |     }))
30 |   };
31 |
32 |   const opciones = {
33 |     extrude: altura_extrusion
34 |   };
35 |
36 |   try {
37 |     const stl = geojson2stl(geojson, opciones);
38 |
39 |     res.setHeader('Content-Type', 'application/octet-stream');
40 |     res.setHeader('Content-Disposition', 'attachment; filename=modelo.stl');
41 |     res.send(stl);
42 |   } catch (err) {
43 |     console.error('Error al generar STL:', err.message);
44 |     res.status(500).json({ error: 'No se pudo generar el archivo STL' });
45 |   }
46 | });
47 |
48 | app.listen(PORT, () => {
49 |   console.log(`Servidor activo en http://localhost:${PORT}`);
50 | });