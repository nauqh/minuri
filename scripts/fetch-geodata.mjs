import { writeFileSync } from 'fs';
import { join } from 'path';
import osmtogeojson from 'osmtogeojson';

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const OUT = join(process.cwd(), 'public', 'geodata');

// Melbourne bounding box: south,west,north,east
const BBOX = '-38.3,144.4,-37.6,145.7';

// Approximate polygon area in deg² (used for park size filtering)
function approxAreaDeg2(coords) {
  const outer = Array.isArray(coords[0][0]) ? coords[0] : coords;
  const lngs = outer.map((c) => c[0]);
  const lats = outer.map((c) => c[1]);
  return (Math.max(...lngs) - Math.min(...lngs)) * (Math.max(...lats) - Math.min(...lats));
}

async function queryOverpass(query) {
  console.log('  querying Overpass...');
  const url = `${OVERPASS}?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'minuri-geodata-fetch/1.0 (minuri app; geodata preparation)',
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`);
  return res.json();
}

function onlyLines(geojson) {
  return {
    type: 'FeatureCollection',
    features: geojson.features.filter(
      (f) => f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString',
    ),
  };
}

// Ramer-Douglas-Peucker line simplification
function perpDist(point, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return Math.sqrt((point[0]-a[0])**2 + (point[1]-a[1])**2);
  return Math.abs(dy * point[0] - dx * point[1] + b[0]*a[1] - b[1]*a[0]) / mag;
}

function rdp(pts, eps) {
  if (pts.length <= 2) return pts;
  let maxD = 0, maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    const l = rdp(pts.slice(0, maxI + 1), eps);
    const r = rdp(pts.slice(maxI), eps);
    return [...l.slice(0, -1), ...r];
  }
  return [pts[0], pts[pts.length - 1]];
}

function simplify(geojson, eps) {
  return {
    ...geojson,
    features: geojson.features.map((f) => {
      const g = f.geometry;
      if (!g) return f;
      let coordinates;
      if (g.type === 'LineString') coordinates = rdp(g.coordinates, eps);
      else if (g.type === 'MultiLineString') coordinates = g.coordinates.map((r) => rdp(r, eps));
      else if (g.type === 'Polygon') coordinates = g.coordinates.map((r) => rdp(r, eps));
      else if (g.type === 'MultiPolygon') coordinates = g.coordinates.map((p) => p.map((r) => rdp(r, eps)));
      else return f;
      return { ...f, geometry: { ...g, coordinates } };
    }),
  };
}

function roundCoords(geojson, precision = 5) {
  const factor = Math.pow(10, precision);
  const round = (n) => Math.round(n * factor) / factor;
  const roundRing = (ring) => ring.map(([lng, lat]) => [round(lng), round(lat)]);
  return {
    ...geojson,
    features: geojson.features.map((f) => {
      const g = f.geometry;
      if (!g) return f;
      let coords;
      if (g.type === 'LineString') coords = roundRing(g.coordinates);
      else if (g.type === 'MultiLineString') coords = g.coordinates.map(roundRing);
      else if (g.type === 'Polygon') coords = g.coordinates.map(roundRing);
      else if (g.type === 'MultiPolygon') coords = g.coordinates.map((p) => p.map(roundRing));
      else return f;
      return { ...f, geometry: { ...g, coordinates: coords } };
    }),
  };
}

// ── Tram tracks (physical ways, not route relations — avoids duplicate overlapping geometries) ──

console.log('\nFetching Melbourne tram tracks...');
const tramQuery = `[out:json][timeout:120][bbox:${BBOX}];
(
  way["railway"="tram"];
);
out geom;`;

try {
  const tramOsm = await queryOverpass(tramQuery);
  const tramRaw = osmtogeojson(tramOsm);
  const trams = roundCoords(simplify({
    type: 'FeatureCollection',
    // strip all properties — only geometry used for rendering
    features: onlyLines(tramRaw).features.map((f) => ({ ...f, properties: {} })),
  }, 0.00008), 4);
  writeFileSync(`${OUT}/melbourne-trams.geojson`, JSON.stringify(trams));
  const size = (JSON.stringify(trams).length / 1024).toFixed(1);
  console.log(`  ✓ ${trams.features.length} tram track segments — ${size} KB`);
} catch (e) {
  console.error(`  ✗ tram fetch failed: ${e.message}`);
}

// ── Train tracks (physical ways, exclude industrial/heritage) ──

console.log('\nFetching Melbourne train tracks...');
const trainQuery = `[out:json][timeout:120][bbox:${BBOX}];
(
  way["railway"="rail"]["usage"!="industrial"]["usage"!="tourism"]["service"!="yard"]["service"!="siding"];
);
out geom;`;

try {
  const trainOsm = await queryOverpass(trainQuery);
  const trainRaw = osmtogeojson(trainOsm);
  const trains = roundCoords(simplify({
    type: 'FeatureCollection',
    features: onlyLines(trainRaw).features.map((f) => ({ ...f, properties: {} })),
  }, 0.0002), 4);
  writeFileSync(`${OUT}/melbourne-trains.geojson`, JSON.stringify(trains));
  const size = (JSON.stringify(trains).length / 1024).toFixed(1);
  console.log(`  ✓ ${trains.features.length} train route segments — ${size} KB`);
} catch (e) {
  console.error(`  ✗ train fetch failed: ${e.message}`);
}

// ── Melbourne parks ──

console.log('\nFetching Melbourne parks from OSM...');
const parksQuery = `[out:json][timeout:120][bbox:${BBOX}];
(
  way["leisure"="park"]["name"];
  relation["leisure"="park"]["name"];
);
out geom;`;

try {
  const parksOsm = await queryOverpass(parksQuery);
  const parksRaw = osmtogeojson(parksOsm);

  // Keep named polygons with approximate area > 0.00003 deg² (~15 ha) — major parks only
  const MIN_AREA = 0.00003;
  const parks = roundCoords(simplify({
    type: 'FeatureCollection',
    features: parksRaw.features
      .filter((f) => {
        const isPolygon = f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon';
        const name = f.properties?.name;
        if (!isPolygon || !name) return false;
        const coords = f.geometry.type === 'MultiPolygon'
          ? f.geometry.coordinates[0]
          : f.geometry.coordinates;
        return approxAreaDeg2(coords) > MIN_AREA;
      })
      .map((f) => ({ ...f, properties: { PARK_NAME: f.properties.name } })),
  }, 0.0001), 4);

  writeFileSync(`${OUT}/melbourne-parks.geojson`, JSON.stringify(parks));
  const size = (JSON.stringify(parks).length / 1024).toFixed(1);
  console.log(`  ✓ ${parks.features.length} parks — ${size} KB`);
} catch (e) {
  console.error(`  ✗ parks fetch failed: ${e.message}`);
}

console.log('\nDone. Files in public/geodata/');
