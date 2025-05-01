const centroid = require('@turf/centroid').default;
const bbox = require('@turf/bbox').default;
const projection = require('@turf/projection');
const earcut = require('earcut');
const path = require('path');

// Valores por defecto
const DEFAULT_OUTPUT = './output.stl';
const DEFAULT_EXTRUDE = 1;
const DEFAULT_SIZE = 200;

module.exports = (geojson, options = {}) => {
    const output = options.output || DEFAULT_OUTPUT;
    const extrude = options.extrude || DEFAULT_EXTRUDE;
    const size = options.size || DEFAULT_SIZE;

    const projected = projection.toMercator(geojson);
    const scaled = scaleFeatures(projected, size);

    let facets = '';
    for (let i = 0; i < scaled.features.length; i++) {
        const geom = scaled.features[i].geometry;
        if (geom.type === 'Polygon') {
            const feature = geom.coordinates[0];
            facets += convertFeature(feature, extrude, size);
        } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach(polygon => {
                const feature = polygon[0];
                facets += convertFeature(feature, extrude, size);
            });
        }
    }

    const filename = path.parse(output).name;
    return combineStl(filename, facets);
};

// ---- Funciones auxiliares ---- //

const convertFeature = (feature, extrusion, size) => {
    let stl = '';
    const flattened = feature.flat();
    const triangles = earcut(flattened, null, 2);

    for (let i = 0; i < triangles.length; i += 3) {
        const a = pointTo3D(flattened.slice(triangles[i] * 2, triangles[i] * 2 + 2), 0);
        const b = pointTo3D(flattened.slice(triangles[i + 1] * 2, triangles[i + 1] * 2 + 2), 0);
        const c = pointTo3D(flattened.slice(triangles[i + 2] * 2, triangles[i + 2] * 2 + 2), 0);
        stl += triangleToStl(a, b, c);
    }
    return stl;
};

const pointTo3D = ([x, y], z) => [x, y, z];

const triangleToStl = (a, b, c) => {
    const facet = `
facet normal 0 0 0
  outer loop
    vertex ${a.join(' ')}
    vertex ${b.join(' ')}
    vertex ${c.join(' ')}
  endloop
endfacet
`;
    return facet;
};

const combineStl = (name, facets) => {
    return `solid ${name}\n${facets}endsolid ${name}\n`;
};

const scaleFeatures = (geojson, targetSize) => {
    const bounds = bbox(geojson);
    const dx = bounds[2] - bounds[0];
    const dy = bounds[3] - bounds[1];
    const scale = targetSize / Math.max(dx, dy);

    geojson.features.forEach(f => {
        f.geometry.coordinates = f.geometry.coordinates.map(polygon =>
            polygon.map(([x, y]) => [x * scale, y * scale])
        );
    });

    return geojson;
};
