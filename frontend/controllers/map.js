// ----- CONFIGURACIÓN GLOBAL -----
let routeLayer = null;
let routeLine = null;
let interestPoints = [];
let routeStarted = false;
let currentRoute = 'sigchos-chugchilan';
let destinationReached = false;
let destinationRadius = 200; // metros

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

// ----- MAPA BASE -----
const map = L.map('map', { zoomControl: true }).setView([-0.9, -78.8], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ----- CARGAR PUNTOS DE INTERÉS -----
async function loadInterestPoints(lang = 'es') {
    try {
        const fileName = `./data/points/points-${lang}.json`;
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

    const gpxFile = `./data/gpx/${routeName}.gpx`;

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

// Cargar ruta inicial
let gpxLayer = null;
loadGPXRoute(currentRoute);

// ----- MARCADOR TRIANGULAR -----
function makeHeadingIcon(angleDeg = 0) {
    return L.divIcon({
        className: 'heading-icon',
        html: `
          <svg class="heading-shadow" viewBox="0 0 100 100" style="transform:rotate(${angleDeg}deg)">
            <path d="M50 6 L72 68 Q50 58 28 68 Z" fill="#1d4ed8" stroke="#0f3fb1" stroke-width="4" />
            <circle cx="50" cy="58" r="6" fill="#fff" opacity=".9"/>
          </svg>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
}

let headingDeg = null;
let follow = true;
let youMarker = null;
let accuracyCircle = null;
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
    map.locate({ watch: true, setView: true, maxZoom: 17, enableHighAccuracy: true });
});

map.on('locationfound', (e) => {
    const latlng = e.latlng;

    if (!youMarker) {
        youMarker = L.marker(latlng, {
            icon: makeHeadingIcon(headingDeg ?? 0), zIndexOffset: 1000
        }).addTo(map);
    } else {
        youMarker.setLatLng(latlng);
        const el = youMarker.getElement()?.querySelector('svg');
        if (el && headingDeg != null) el.style.transform = `rotate(${headingDeg}deg)`;
    }

    if (!accuracyCircle) {
        accuracyCircle = L.circle(latlng, {
            radius: e.accuracy || 15,
            weight: 1,
            color: '#2563eb',
            opacity: .6
        }).addTo(map);
    } else {
        accuracyCircle.setLatLng(latlng);
        accuracyCircle.setRadius(e.accuracy || 15);
    }

    if (follow) map.setView(latlng, Math.max(map.getZoom(), 16), { animate: false });

    checkOffRoute(latlng);
});

map.on('locationerror', (e) => {
    console.error('Error de ubicación:', e);
    showBanner('⚠️ No se pudo obtener ubicación');
});

// ----- BRÚJULA -----
function handleOrientation(ev) {
    if (typeof ev.alpha === 'number') {
        headingDeg = 360 - ev.alpha;
        const el = youMarker?.getElement()?.querySelector('svg');
        if (el) el.style.transform = `rotate(${headingDeg}deg)`;
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
    } catch {
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
loadInterestPoints(savedLang);
showInitialMessage();