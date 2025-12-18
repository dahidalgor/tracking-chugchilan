# 🏔️ Tracking Quilotoa - Guía Rápida

## 📋 Archivos principales

```
frontend/
├── index.html           # Página principal
├── styles.css          # Estilos
├── points.json         # Puntos de interés (editable)
└── quilotoa_trail.gpx  # Ruta del trekking
```

## ✨ Nuevas características implementadas

### 1. 🚀 Botón INICIAR
- Click en **"🚀 INICIAR"** para comenzar el trekking
- Automáticamente solicita acceso a tu ubicación GPS
- El botón cambia a **"✓ INICIADO"** cuando está activo
- La ruta solo alerta si te alejas cuando el trekking ha iniciado

### 2. 🎯 Puntos de Interés
- Se cargan desde `points.json` al iniciar la página
- Aparecen como marcadores dorados en el mapa
- Click en cualquier marcador para ver titulo y descripción
- Funcionan completamente offline

### 3. 📱 Funcionalidad Offline Completa
- Todos los datos se cargan una sola vez al iniciar
- Sin conexión, usa la caché del navegador para el mapa
- Los puntos de interés siempre están disponibles

### 4. 🎨 Ruta destacada
- La ruta de Chugchilan a Quilotoa está en azul (#2563eb)
- Tú apareces como triangulo azul
- Tu área de precisión es un círculo azul claro

## 🎮 Controles del mapa

| Botón | Función |
|-------|---------|
| 🚀 INICIAR | Comenzar trekking y solicitar ubicación |
| 🧭 Seguir ON/OFF | Centrar mapa en tu ubicación mientras caminas |
| 📍 Mi ubicación | Centrar mapa en tu posición actual |
| 🧲 Brújula | Activar brújula del dispositivo (solo móviles) |

## 🛤️ Cómo funciona la RUTA

### La ruta se pinta automáticamente con estos colores:

| Momento | Color | Grosor |
|---------|-------|--------|
| **Mapa inicial** | Azul oscuro (#2563eb) | 4px |
| **Después de INICIAR** | Cyan brillante (#18c1e6) | 6px |

### La ruta viene del archivo:
```
frontend/quilotoa_trail.gpx
```

**Al hacer click en "🚀 INICIAR", la ruta se destaca automáticamente con color cyan y grosor aumentado para que sea más visible mientras caminas.**

### Cambiar los colores de la ruta

**Opción A: Color antes de iniciar**
- Abre `frontend/index.html`
- Busca línea ~270: `polyline_options: { color:'#2563eb', weight:4, opacity:.95 }`
- Cambia `#2563eb` por el HEX deseado

**Opción B: Color después de iniciar**
- Abre `frontend/index.html`
- Busca línea ~310: `color: '#18c1e6'`
- Cambia `#18c1e6` por el HEX deseado

Para más detalles sobre crear/modificar archivos GPX, lee `AGREGAR_PUNTOS_INTERES.md` → Sección "🛤️ Cómo funciona la RUTA"

## 📍 Cómo agregar puntos de interés

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
      "lat": -0.9450,
      "lng": -78.8234,
      "title": "Laguna Quilotoa",
      "description": "Destino final del trekking"
    }
  ]
}
```

### Paso 2: Agregar un nuevo punto

1. Busca las **coordenadas GPS** del lugar en [Google Maps](https://maps.google.com)
2. Copia la estructura de un punto existente
3. Dale un `id` nuevo (ejemplo: si el último es 2, este será 3)
4. Rellena los datos:

```json
{
  "id": 3,
  "lat": -0.9350,
  "lng": -78.8190,
  "title": "Casa Comunal",
  "description": "Punto de descanso con servicios disponibles"
}
```

### Paso 3: Guardar el archivo

- Asegúrate de que el JSON esté bien formado
- **Verificar:** Usa [jsonlint.com](https://jsonlint.com) si tienes dudas

## 🗺️ Cómo obtener coordenadas

### Desde Google Maps
1. Abre https://maps.google.com
2. Busca el lugar
3. Haz clic derecho → Copiar coordenadas
4. Pégalas: `lat, lng` (ejemplo: `-0.9234,-78.8156`)

### Desde URL de Google Maps
- Si la URL es: `https://maps.google.com/?q=-0.9234,-78.8156`
- Entonces: `lat = -0.9234`, `lng = -78.8156`

## ⚙️ Configuración

### Cambiar radio de alerta
En `index.html`, línea ~290, busca `if (dist > 30)` y cambia `30` por metros deseados.

### Cambiar altura del mapa
En `styles.css`, busca `#map{` y ajusta `height:60vh` (60% de la pantalla).

### Cambiar color de la ruta
En `index.html`, línea ~40, busca `color:'#2563eb'` y cambia el color HEX.

### Cambiar color de la ruta cuando se INICIA el trekking
En `index.html`, línea ~310, dentro de `btnStart`, busca `color: '#18c1e6'` y cambia el color HEX.

**Colores actuales:**
- **Antes de iniciar:** Azul oscuro `#2563eb`
- **Al iniciar:** Cyan brillante `#18c1e6`
- **Grosor al iniciar:** Se aumenta a 6px (de 4px)

## 🐛 Solución de problemas

### Los puntos no aparecen en el mapa
- Verifica que `points.json` esté en la carpeta `frontend/`
- Abre la consola del navegador (F12) para ver errores
- Valida el JSON en [jsonlint.com](https://jsonlint.com)

### No me solicita ubicación al hacer click en INICIAR
- Necesitas HTTPS (en localhost funciona sin HTTPS)
- Verifica que hayas dado permisos al navegador
- Intenta en navegador privado si sigues teniendo problemas

### El mapa no se ve sin internet
- Primera vez SIEMPRE necesita internet
- El navegador guarda en caché automáticamente
- Próximas veces funcionará sin internet

### Los alertas de ruta no se muestran
- Solo funcionan después de hacer click en "INICIAR"
- Necesitas estar fuera de la ruta por más de 30 metros

## 📚 Información técnica

- **Mapa:** Leaflet.js + OpenStreetMap
- **Cálculo de distancias:** Turf.js
- **Datos:** JSON local (offline-first)
- **Brújula:** DeviceOrientation API
- **GPS:** Geolocation API

## 🚀 Instalación

1. Clona el repositorio
2. Abre `frontend/index.html` en un navegador (preferiblemente HTTPS o localhost)
3. Los datos se cargan automáticamente
4. ¡Listo para trekkear! 🏔️

---

Para más detalles sobre agregar puntos, lee `AGREGAR_PUNTOS_INTERES.md`
