# 📍 Documentación: Agregar Puntos de Interés

## 📍 Documentación: Agregar Puntos de Interés y Configurar Ruta

## 🛤️ Cómo funciona la RUTA

### Ubicación del archivo
- **Archivo:** `frontend/quilotoa_trail.gpx`
- **Formato:** GPX (GPS Exchange Format)

### Cómo se pinta la ruta

La ruta se carga automáticamente del archivo `quilotoa_trail.gpx` y se pinta en el mapa con estos colores:

| Estado | Color | HEX | Grosor |
|--------|-------|-----|--------|
| **Antes de iniciar** | Azul oscuro | `#2563eb` | 4px |
| **Después de iniciar** | Cyan brillante | `#18c1e6` | 6px |

### Cambiar el color de la ruta ANTES de iniciar

1. Abre `frontend/index.html`
2. Busca la línea ~270 donde dice:
```javascript
polyline_options: { color:'#2563eb', weight:4, opacity:.95 }
```
3. Cambia `#2563eb` por el color HEX que desees
4. Ejemplo: `color:'#ff6b6b'` para rojo

### Cambiar el color de la ruta AL INICIAR

1. Abre `frontend/index.html`
2. Busca la línea ~310 donde dice:
```javascript
gpxLayer.setStyle({ 
  color: '#18c1e6',
  weight: 6,
  opacity: 1
});
```
3. Cambia `#18c1e6` por el color HEX deseado
4. Ejemplo: `color:'#00ff00'` para verde

### Cambiar el grosor de la ruta

- **Grosor inicial:** `weight:4` en la línea ~270
- **Grosor al iniciar:** `weight: 6` en la línea ~310
- Aumenta el número para que sea más gruesa (máximo ~12)

### Ejemplos de códigos HEX para colores

```javascript
// Colores fríos
'#2563eb'  // Azul oscuro (azul de ruta inicial)
'#18c1e6'  // Cyan brillante (azul al iniciar)
'#0066ff'  // Azul puro
'#00ffff'  // Cyan puro

// Colores cálidos
'#ff6b6b'  // Rojo brillante
'#ffa500'  // Naranja
'#ffeb3b'  // Amarillo
'#00ff00'  // Verde

// Colores oscuros
'#000000'  // Negro
'#8b4513'  // Marrón
```

### Visualización en tiempo real

Cuando inicias el trekking:
1. La ruta **cambia de azul oscuro a cyan**
2. El grosor **aumenta de 4px a 6px** (más visible)
3. La opacidad se **vuelve máxima** (100%)
4. Todo esto sucede **automáticamente**

Ejemplo visual:
```
ANTES:    ═══════ (delgada, azul oscuro)
DESPUÉS:  ═══════════ (gruesa, cyan brillante)
```

### Cómo crear un archivo GPX

#### Opción 1: Desde Google Maps
1. Abre [Google My Maps](https://www.google.com/maps/d/)
2. Crea un nuevo mapa
3. Dibuja la ruta click a click
4. Haz clic derecho en la ruta → Descargar como KML
5. Convierte KML a GPX en [MyGeodata Converter](https://mygeodata.cloud/converter/kml-to-gpx)

#### Opción 2: Desde OpenStreetMap
1. Abre [OpenStreetMap](https://www.openstreetmap.org)
2. Usa herramientas para planificar ruta
3. Exporta como GPX

#### Opción 3: Desde un GPS/Teléfono
1. Camina la ruta con una app GPS (Strava, AllTrails, etc.)
2. Exporta la grabación como archivo GPX
3. Copia el archivo a `frontend/`

### Dónde guardar el archivo GPX

```
frontend/
├── index.html
├── styles.css
├── points.json
└── quilotoa_trail.gpx  ← Aquí va tu ruta
```

### Formato del archivo GPX

Un archivo GPX básico se ve así:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OpenStreetMap">
  <trk>
    <name>Quilotoa Trail</name>
    <trkseg>
      <trkpt lat="-0.9234" lon="-78.8156"><ele>3200</ele></trkpt>
      <trkpt lat="-0.9250" lon="-78.8160"><ele>3220</ele></trkpt>
      <trkpt lat="-0.9350" lon="-78.8190"><ele>3300</ele></trkpt>
      <trkpt lat="-0.9450" lon="-78.8234"><ele>3350</ele></trkpt>
    </trkseg>
  </trk>
</gpx>
```

**Componentes:**
- `<trkpt>`: Cada punto de la ruta
- `lat`: Latitud
- `lon`: Longitud (nota: en GPX es "lon", no "lng")
- `<ele>`: Elevación en metros (opcional)

---

## Ubicación del archivo
- **Archivo:** `frontend/points.json`
- **Formato:** JSON

## Estructura de un punto de interés

```json
{
  "id": 1,
  "lat": -0.9234,
  "lng": -78.8156,
  "title": "Nombre del lugar",
  "description": "Descripción breve del lugar"
}
```

## Campos obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | Número | Identificador único (mayor a 0) | `1`, `2`, `3` |
| `lat` | Número | Latitud en formato decimal | `-0.9234` |
| `lng` | Número | Longitud en formato decimal | `-78.8156` |
| `title` | String | Título del punto (máx. 50 caracteres) | `"Laguna Quilotoa"` |
| `description` | String | Descripción breve (máx. 150 caracteres) | `"Destino final del trekking"` |

## Cómo obtener las coordenadas GPS

### Opción 1: Google Maps
1. Abre [Google Maps](https://maps.google.com)
2. Busca el lugar o haz clic en la ubicación exacta
3. Haz clic derecho y selecciona las coordenadas
4. Las coordenadas aparecerán en el formato: `latitud, longitud`

### Opción 2: OpenStreetMap
1. Abre [OpenStreetMap](https://www.openstreetmap.org)
2. Busca el lugar
3. Haz clic en la ubicación
4. Las coordenadas aparecerán en la barra lateral

### Opción 3: Copiar desde la URL
- Google Maps: `https://maps.google.com/?q=-0.9234,-78.8156`
- Los números al final son lat,lng

## Ejemplo completo con 3 puntos

```json
{
  "points": [
    {
      "id": 1,
      "lat": -0.9234,
      "lng": -78.8156,
      "title": "Punto de Inicio - Chugchilan",
      "description": "Inicio del trekking Quilotoa Trail"
    },
    {
      "id": 2,
      "lat": -0.9350,
      "lng": -78.8190,
      "title": "Casa Comunal",
      "description": "Punto de descanso intermedio con servicios"
    },
    {
      "id": 3,
      "lat": -0.9450,
      "lng": -78.8234,
      "title": "Laguna Quilotoa",
      "description": "Destino final del trekking. Vista panorámica del cráter lacustre"
    }
  ]
}
```

## Cómo agregar un nuevo punto

1. Abre el archivo `frontend/points.json`
2. Ubica el último punto en el array
3. Agrega una coma después del último punto
4. Copia la estructura anterior y rellena los datos:
   - Dale un `id` único (mayor al último id usado)
   - Busca las coordenadas del lugar
   - Escribe un título descriptivo
   - Agrega una descripción breve

## Recomendaciones

- **IDs únicos:** Asegúrate de que cada punto tenga un ID diferente
- **Descripción breve:** Máximo 150 caracteres para mantener la web ligera
- **Coordenadas precisas:** Usa decimales con al menos 4 lugares (ejemplo: -0.9234)
- **Orden:** Es recomendable ordenar los puntos de norte a sur o del inicio al fin de la ruta

## Validación

Si al abrir la web ves errores en la consola del navegador, verifica:
1. Que el JSON esté bien formado (usa [jsonlint.com](https://jsonlint.com))
2. Que todas las comillas sean `"` (no `'` o `''`)
3. Que no haya comas finales innecesarias
4. Que los números de lat/lng sean válidos

## Cómo funciona offline

- Los puntos se cargan **una sola vez** al iniciar la web
- Si hay internet, se descargan todos los datos del mapa de OpenStreetMap
- Si NO hay internet, se usa la caché del navegador
- Los puntos de interés **siempre funcionan** sin conexión, están guardados en `points.json`
