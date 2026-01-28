// ----- CONFIGURACIÓN GLOBAL -----
let routeLayer = null;
let routeLine = null;
let interestPoints = [];
let routeStarted = false;
let currentRoute = 'sigchos-chugchilan';
let destinationReached = false;
let destinationRadius = 200; // metros
let map = null; // Será inicializado cuando sea necesario
let mapInitialized = false;

// Configuración de destinos por ruta
const routeDestinations = {
    'sigchos-chugchilan': {
        name: 'Chugchilan',
        coordinates: [-0.7, -78.8] // Aproximadas para Chugchilan
    },
    'chugchilan-quilotoa': {
        name: 'Quilotoa',
        coordinates: [-0.92, -78.94] // Aproximadas para Quilotoa
    }
};

// ----- MARCADOR TRIANGULAR (DEFINIDO TEMPRANO) -----
function makeHeadingIcon(angleDeg = 0) {
    return L.divIcon({
        className: 'heading-icon',
        html: `
          <svg class="heading-shadow" viewBox="0 0 100 100" style="transform:rotate(${angleDeg}deg); width: 40px; height: 40px;">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.5"/>
              </filter>
            </defs>
            <path d="M50 10 L80 70 Q50 60 20 70 Z" fill="#1d4ed8" stroke="#0f3fb1" stroke-width="3" filter="url(#shadow)" />
            <circle cx="50" cy="55" r="7" fill="#fff" opacity="0.95"/>
          </svg>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
}

// ----- VARIABLES GLOBALES PARA GEOLOCALIZACIÓN -----
let headingDeg = null;
let follow = true;
let youMarker = null;
let accuracyCircle = null;

// ----- INICIALIZAR MAPA PEREZOSAMENTE (LAZY LOADING) -----
function initializeMap() {
    if (mapInitialized) return;
    
    console.log('[Map] Inicializando mapa...');
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('[Map] Elemento #map no encontrado');
        return;
    }
    
    map = L.map('map', { zoomControl: true }).setView([-0.9, -78.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, 
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    
    // Registrar event listeners de geolocalización DESPUÉS de crear el mapa
    map.on('locationfound', (e) => {
        const latlng = e.latlng;
        const accuracy = e.accuracy || 15;
        const precisionThreshold = 30; // metros - cuando la precisión es buena
        
        console.log('[Map] Ubicación encontrada:', latlng, 'Precisión:', accuracy, 'm');

        if (!youMarker) {
            youMarker = L.marker(latlng, {
                icon: makeHeadingIcon(headingDeg ?? 0), zIndexOffset: 1000
            }).addTo(map);
            console.log('[Map] Marcador de usuario creado en:', latlng);
        } else {
            youMarker.setLatLng(latlng);
            const el = youMarker.getElement()?.querySelector('svg');
            if (el && headingDeg != null) {
                el.style.transform = `rotate(${headingDeg}deg)`;
            }
        }

        if (!accuracyCircle) {
            accuracyCircle = L.circle(latlng, {
                radius: accuracy,
                weight: 2,
                color: '#2563eb',
                fillColor: '#2563eb',
                opacity: 0.8,
                fillOpacity: 0.2
            }).addTo(map);
            console.log('[Map] Círculo de precisión creado con radio:', accuracy, 'm');
        } else {
            accuracyCircle.setLatLng(latlng);
            accuracyCircle.setRadius(accuracy);
            console.log('[Map] Círculo de precisión actualizado:', accuracy, 'm');
        }

        // Si la precisión es buena (< 30m), ocultar el círculo y mostrar solo la flecha
        if (accuracy < precisionThreshold) {
            if (map.hasLayer(accuracyCircle)) {
                map.removeLayer(accuracyCircle);
                console.log('[Map] Círculo de precisión oculto (precisión buena)');
            }
        } else {
            // Si la precisión es mala, mostrar el círculo
            if (!map.hasLayer(accuracyCircle)) {
                accuracyCircle.addTo(map);
                console.log('[Map] Círculo de precisión visible (precisión mala)');
            }
        }

        if (follow) map.setView(latlng, Math.max(map.getZoom(), 16), { animate: false });

        checkOffRoute(latlng);
    });

    map.on('locationerror', (e) => {
        console.error('[Map] Error de ubicación:', e);
        showBanner('⚠️ No se pudo obtener ubicación');
    });
    
    mapInitialized = true;
    console.log('[Map] Mapa inicializado correctamente con listeners de geolocalización');
    
    // Cargar datos una vez inicializado
    loadInterestPoints();
    loadCurrentRoute();
}

// ----- MAPA BASE -----

// ----- CARGAR PUNTOS DE INTERÉS -----
async function loadInterestPoints(lang = 'es') {
    try {
        const fileName = `../data/points/points-${lang}.json`;
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`No se pudo cargar ${fileName}`);
        const data = await response.json();
        interestPoints = data.points || [];

        // Limpiar marcadores anteriores
        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker && layer !== gpxLayer) {
                map.removeLayer(layer);
            }
        });

        addInterestPointsToMap();
    } catch (error) {
        console.warn('Puntos de interés no disponibles (offline):', error);
    }
}

function addInterestPointsToMap() {
    interestPoints.forEach(point => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 8,
            fillColor: "#85713f",
            color: "#fff",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.8
        }).addTo(map);

        const popupContent = `
          <div class="point-popup">
            <h3>${point.title}</h3>
            <p>${point.description}</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
            marker.openPopup();
        });
    });
}

// ----- CARGAR RUTA GPX DINÁMICA -----
function loadGPXRoute(routeName) {
    // Limpiar ruta anterior
    if (gpxLayer && map.hasLayer(gpxLayer)) {
        map.removeLayer(gpxLayer);
    }

    const gpxFile = `../data/gpx/${routeName}.gpx`;

    gpxLayer = new L.GPX(gpxFile, {
        async: true,
        marker_options: false,
        polyline_options: { color: '#2563eb', weight: 4, opacity: .95 }
    })
        .on('loaded', e => {
            console.log('Ruta ' + routeName + ' cargada correctamente');

            // Remover cualquier marcador que haya creado el plugin
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        })
        .on('error', () => {
            console.error('No se pudo cargar ' + gpxFile);
            showBanner('⚠️ No se pudo cargar la ruta');
        })
        .addTo(map);

    gpxLayer.on('loaded', () => {
        const gj = gpxLayer.toGeoJSON();
        routeLine = (gj.features || [gj]).find(f => f.geometry?.type === 'LineString') || null;

        // Enfocar el mapa para ver toda la ruta
        if (gpxLayer.getBounds) {
            const bounds = gpxLayer.getBounds();
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }

        // Resetear bandera de destino al cambiar de ruta
        destinationReached = false;
        hideCelebrationMessage();
    });
}

// ----- CARGAR RUTA ACTUAL (CON INICIALIZACIÓN PEREZOSA) -----
function loadCurrentRoute() {
    if (!mapInitialized) {
        console.log('[Map] Inicializando mapa antes de cargar ruta');
        initializeMap();
    }
    loadGPXRoute(currentRoute);
}

// Cargar ruta inicial cuando se solicite (no automáticamente)
let gpxLayer = null;

const banner = document.getElementById('banner');

function showBanner(msg) {
    banner.textContent = msg;
    banner.style.display = 'block';
    setTimeout(() => banner.style.display = 'none', 3000);
}

function checkOffRoute(latlng) {
    if (!routeLine || !routeStarted) return;
    const p = turf.point([latlng.lng, latlng.lat]);
    const dist = turf.pointToLineDistance(p, routeLine, { units: 'meters' });
    if (dist > 30) showBanner(translations[currentLanguage].banner.replace('&gt;', '>'));

    // Verificar si se llegó al destino
    checkIfReachedDestination(latlng);
}

// ----- FUNCIONES PARA MENSAJES DE CELEBRACIÓN -----
function updateCelebrationMessageText(lang) {
    const msgElement = document.getElementById('celebrationMessageText');
    if (msgElement && destinationReached) {
        const destName = routeDestinations[currentRoute].name;
        const celebrationKey = destName === 'Chugchilan' ? 'celebrationChugchilan' : 'celebrationQuilotoa';
        msgElement.textContent = translations[lang][celebrationKey];
    }
}

function showCelebrationMessage() {
    const celebrationMsg = document.getElementById('celebrationMessage');
    if (celebrationMsg) {
        const destName = routeDestinations[currentRoute].name;
        const celebrationKey = destName === 'Chugchilan' ? 'celebrationChugchilan' : 'celebrationQuilotoa';
        const msgElement = document.getElementById('celebrationMessageText');
        if (msgElement) {
            msgElement.textContent = translations[currentLanguage][celebrationKey];
        }
        celebrationMsg.classList.add('show');
    }
}

function hideCelebrationMessage() {
    const celebrationMsg = document.getElementById('celebrationMessage');
    if (celebrationMsg) {
        celebrationMsg.classList.remove('show');
    }
}

// ----- MOSTRAR MENSAJE INICIAL -----
function showInitialMessage() {
    const initialMsg = document.getElementById('initialMessage');
    if (initialMsg && !routeStarted) {
        initialMsg.classList.add('show');
    }
}

function hideInitialMessage() {
    const initialMsg = document.getElementById('initialMessage');
    if (initialMsg) {
        initialMsg.classList.remove('show');
    }
}

// ----- VERIFICAR SI SE LLEGÓ AL DESTINO -----
function checkIfReachedDestination(latlng) {
    if (!routeStarted || destinationReached) return;

    const destination = routeDestinations[currentRoute];
    const destPoint = L.latLng(destination.coordinates[0], destination.coordinates[1]);
    const distance = latlng.distanceTo(destPoint);

    if (distance < destinationRadius) {
        destinationReached = true;
        showCelebrationMessage();
    }
}

// ----- SELECTOR DE RUTAS -----
const routeSelector = document.getElementById('routeSelector');
if (routeSelector) {
    routeSelector.addEventListener('change', (e) => {
        currentRoute = e.target.value;
        destinationReached = false;

        // Resetear el estado del trekking al cambiar ruta
        if (routeStarted) {
            routeStarted = false;
            document.getElementById('btnStart').classList.remove('active');
            document.getElementById('btnStart').textContent = translations[currentLanguage].iniciar;
        }

        // Cargar la nueva ruta
        loadGPXRoute(currentRoute);
        hideCelebrationMessage();
        hideInitialMessage();
        showInitialMessage();

        showBanner('Ruta cambiada a ' + e.target.options[e.target.selectedIndex].text);
    });
}

// ----- BOTÓN INICIAR -----
document.getElementById('btnStart').addEventListener('click', function () {
    // Inicializar mapa si no está hecho
    if (!mapInitialized) {
        initializeMap();
    }
    
    if (!routeStarted) {
        routeStarted = true;
        follow = true;
        this.classList.add('active');
        this.textContent = '✓ ' + translations[currentLanguage].iniciar.substring(3); // Quitamos el emoji
        hideInitialMessage();
        showBanner('Trekking iniciado. Solicitar ubicación...');

        // Destacar la ruta - VISIBLE Y BRILLANTE
        if (gpxLayer) {
            gpxLayer.setStyle({
                color: '#18c1e6',
                weight: 6,
                opacity: 1
            });
            // Enfocar la ruta cuando se inicia
            try {
                const bounds = gpxLayer.getBounds();
                const padding = window.innerWidth <= 640 ? [50, 50] : [80, 80];
                map.fitBounds(bounds, { padding, animate: true, duration: 0.8 });
            } catch (e) { console.log('No se pudo enfocar ruta'); }
        }

        // Activar geolocalización automáticamente
        map.locate({ watch: true, setView: true, maxZoom: 17, enableHighAccuracy: true });
        
        // Activar automáticamente el sensor de orientación del dispositivo
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+
                DeviceOrientationEvent.requestPermission()
                    .then(permission => {
                        if (permission === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
                            console.log('[Orientation] Sensor de orientación activado automáticamente');
                        }
                    })
                    .catch(console.error);
            } else {
                // Android y otros navegadores
                window.addEventListener('deviceorientation', handleOrientation, { passive: true });
                console.log('[Orientation] Sensor de orientación activado automáticamente');
            }
        }
    } else {
        // Parar seguimiento
        routeStarted = false;
        follow = false;
        this.classList.remove('active');
        this.textContent = translations[currentLanguage].iniciar;
        if (gpxLayer) {
            gpxLayer.setStyle({
                color: '#2563eb',
                weight: 4,
                opacity: 0.8
            });
        }
        showBanner('Trekking pausado');
    }
});

// ----- GEOLOC -----
document.getElementById('btnLocate').addEventListener('click', () => {
    if (!mapInitialized) {
        initializeMap();
    }
    map.locate({ watch: true, setView: true, maxZoom: 17, enableHighAccuracy: true });
});

// Event listeners de geolocalización movidos a initializeMap()

// ----- BRÚJULA -----
function handleOrientation(ev) {
    if (typeof ev.alpha === 'number') {
        headingDeg = 360 - ev.alpha;
        
        if (youMarker) {
            const markerElement = youMarker.getElement();
            if (markerElement) {
                const svg = markerElement.querySelector('svg');
                if (svg) {
                    svg.style.transform = `rotate(${headingDeg}deg)`;
                    console.log('[Compass] Heading actualizado:', headingDeg.toFixed(1), '°');
                }
            }
        }
    }
}

async function enableCompass() {
    try {
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            const state = await DeviceOrientationEvent.requestPermission();
            if (state !== 'granted') return alert('Permiso de brújula denegado');
        }
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        showBanner('Brújula activada');
        console.log('[Compass] Brújula habilitada');
    } catch (error) {
        console.error('[Compass] Error al habilitar brújula:', error);
        alert('Tu navegador no permite brújula');
    }
}
document.getElementById('btnCompass').onclick = enableCompass;

// ----- TOGGLE SEGUIR -----
document.getElementById('btnFollow').onclick = (ev) => {
    follow = !follow;
    ev.target.textContent = follow ? translations[currentLanguage].seguir : translations[currentLanguage].seguir.replace('ON', 'OFF');
    showBanner(follow ? "Seguir activado" : "Seguir desactivado");
};

// ----- BOTÓN CERRAR CELEBRACIÓN -----
const celebrationCloseBtn = document.getElementById('celebrationCloseBtn');
if (celebrationCloseBtn) {
    celebrationCloseBtn.addEventListener('click', hideCelebrationMessage);
}

// ----- INICIALIZAR -----
const savedLang = localStorage.getItem('preferredLanguage') || 'es';
currentLanguage = savedLang;
showInitialMessage();

// Exportar funciones globales para lazy loading
window.initializeMap = initializeMap;
window.loadCurrentRoute = loadCurrentRoute;