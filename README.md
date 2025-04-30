# GeoJSON to STL Converter

Este proyecto permite convertir archivos **GeoJSON** a modelos 3D en formato **STL**, listos para impresión 3D o visualización.

---

## 🚀 ¿Para qué sirve?

Transforma estructuras geográficas o modelos definidos en coordenadas en archivos STL. Ideal para:

- Prototipado rápido.
- Visualización de datos geoespaciales.
- Exportaciones desde plataformas de mapeo.

---

## 📦 Estructura del proyecto

. ├── bin/geojson2stl → Script de conversión desde línea de comandos ├── src/index.js → Lógica principal de conversión ├── tests/ → Archivos de prueba (GeoJSON y STL generados) ├── package.json → Configuración de dependencias y scripts

---

## ✅ Requisitos previos

- Tener instalado [Node.js](https://nodejs.org) en tu ordenador.

---

## 🛠️ Instalación

```bash
npm install
⚙️ Uso
node bin/geojson2stl tests/test.geojson tests/test.stl
Cambia tests/test.geojson por el nombre del archivo de entrada.

Cambia tests/test.stl por el nombre del archivo STL que quieres generar.

🧪 Pruebas

node tests/index-test.js
📄 Licencia
MIT © UpToBe Marketing
