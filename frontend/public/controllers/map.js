// ----- CONFIGURACIÓN GLOBAL -----
console.log('[Map] Cargando map.js...');
console.log('[Map] Leaflet disponible:', typeof L !== 'undefined');

// Detectar la ruta base correcta
function getBasePath() {
    const currentPath = window.location.pathname;
    // Si estamos en /public/... o en /... en distribución
    if (currentPath.includes('/public/')) {
        return './';
    }
    return './';
}

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
          <svg class="heading-shadow" viewBox="0 0 100 100" style="transform:rotate(${angleDeg}deg)">
            <path d="M50 6 L72 68 Q50 58 28 68 Z" fill="#1d4ed8" stroke="#0f3fb1" stroke-width="4" />
            <circle cx="50" cy="58" r="6" fill="#fff" opacity=".9"/>
          </svg>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
}

// ----- VARIABLES GLOBALES PARA GEOLOCALIZACIÓN -----
let headingDeg = null;
let initialHeading = null;  // Capturar el ángulo inicial de la brújula
let lastDeviceHeading = null; // Último heading absoluto recibido del dispositivo
let markerInitialMapAngle = 0; // Ángulo base con el que se creó el marcador (en grados, relativo al norte del mapa)
let deviceToMarkerOffset = null; // Corrección (deg) para alinear la punta del marcador con el dispositivo
let follow = false;  // POR DEFECTO OFF - solo activar al presionar INICIAR
let youMarker = null;
let accuracyCircle = null;
let lastLocationUpdate = 0;
let lastLogTime = 0;
let lastPositionLogged = null;
const MIN_UPDATE_INTERVAL = 3000; // Esperar 3 segundos entre actualizaciones
const MIN_LOG_INTERVAL = 2000;     // Log solo cada 2 segundos
const MIN_DISTANCE_CHANGE = 5;     // Actualizar si cambio > 5 metros
const LOCATE_HIDE_DISTANCE = 50; // metros: debajo de esto ocultar botón 'Mi ubicación'
const LOCATE_MIN_ZOOM = 16; // zoom mínimo para considerar "cerca"

// Actualiza la UI del botón de seguimiento (usa getElementById para evitar problemas de hoisting)
function updateFollowButtonUI() {
    const el = document.getElementById('btnFollow');
    if (el) {
        el.textContent = follow ? '🧭 Seguir ON' : '🧭 Seguir OFF';
        el.title = follow ? 'Desactivar seguimiento' : 'Activar seguimiento';
    }
}

// Cambia el estado de seguimiento y gestiona el watcher de geolocalización
function setFollow(value) {
    follow = value;
    updateFollowButtonUI();
    if (map) {
        try {
            if (follow) {
                map.locate({ watch: true, setView: true, maxZoom: 17, enableHighAccuracy: true, timeout: 10000 });
            } else {
                map.stopLocate();
            }
        } catch (e) {
            console.warn('[Map] No se pudo cambiar watch de geolocalización:', e);
        }
    }
}

// Mostrar u ocultar botón 'Mi ubicación' según distancia al centro y zoom
function updateLocateVisibility() {
    const btn = document.getElementById('btnLocate');
    if (!btn || !map) return;
    const userPos = lastPositionLogged;
    if (!userPos) {
        btn.classList.remove('hidden');
        return;
    }
    try {
        const center = map.getCenter();
        const dist = center.distanceTo(userPos);
        if (dist < LOCATE_HIDE_DISTANCE && map.getZoom() >= LOCATE_MIN_ZOOM) {
            btn.classList.add('hidden');
        } else {
            btn.classList.remove('hidden');
        }
    } catch (e) {
        // Si hay algún error, aseguramos que esté visible
        btn.classList.remove('hidden');
    }
}

// ----- INICIALIZAR MAPA PEREZOSAMENTE (LAZY LOADING) -----
function initializeMap() {
    console.log('[Map] ========== INICIANDO MAPA ==========');
    console.log('[Map] mapInitialized:', mapInitialized);
    console.log('[Map] map exists:', !!map);
    
    if (mapInitialized) {
        console.log('[Map] Mapa ya está inicializado. Reajustando tamaño...');
        // Si ya está inicializado, solo reajusta el tamaño
        if (map) {
            console.log('[Map] Llamando a invalidateSize()');
            setTimeout(() => {
                try {
                    map.invalidateSize();
                    console.log('[Map] invalidateSize() completado exitosamente');
                } catch (e) {
                    console.error('[Map] Error en invalidateSize():', e);
                }
            }, 50);
        }
        return;
    }
    
    console.log('[Map] Primera inicialización del mapa');
    
    const mapElement = document.getElementById('map');
    console.log('[Map] mapElement encontrado:', !!mapElement);
    
    if (!mapElement) {
        console.error('[Map] ❌ CRÍTICO: Elemento #map no encontrado en el DOM');
        console.log('[Map] Elementos disponibles en la página:', document.querySelectorAll('[id]').length);
        return;
    }

    console.log('[Map] Propiedades del contenedor:');
    console.log('[Map] - offsetHeight:', mapElement.offsetHeight);
    console.log('[Map] - offsetWidth:', mapElement.offsetWidth);
    console.log('[Map] - display:', window.getComputedStyle(mapElement).display);
    console.log('[Map] - visibility:', window.getComputedStyle(mapElement).visibility);
    console.log('[Map] - position:', window.getComputedStyle(mapElement).position);
    
    // Verificar que el contenedor es visible
    const isVisible = mapElement.offsetHeight > 0 && mapElement.offsetWidth > 0;
    console.log('[Map] ¿Contenedor visible?', isVisible);
    
    if (!isVisible) {
        console.warn('[Map] ⚠️ El contenedor del mapa no es visible. offsetHeight=' + mapElement.offsetHeight + ', offsetWidth=' + mapElement.offsetWidth);
        console.log('[Map] Esperando 200ms y reintentando...');
        // Reintentar después de un pequeño delay
        setTimeout(() => {
            const mapEl = document.getElementById('map');
            const h = mapEl ? mapEl.offsetHeight : 0;
            const w = mapEl ? mapEl.offsetWidth : 0;
            console.log('[Map] Reintento: offsetHeight=' + h + ', offsetWidth=' + w);
            if (h > 0 && w > 0) {
                console.log('[Map] Contenedor ahora es visible, inicializando...');
                initializeMap();
            } else {
                console.error('[Map] ❌ El contenedor sigue invisible después del reintento');
            }
        }, 200);
        return;
    }
    
    try {
        console.log('[Map] Creando instancia de Leaflet...');
        map = L.map('map', { zoomControl: true }).setView([-0.9, -78.8], 13);
        console.log('[Map] ✓ Mapa Leaflet creado correctamente');
        
        console.log('[Map] Agregando tile layer de OpenStreetMap...');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, 
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        console.log('[Map] ✓ Tile layer agregado');
    } catch (error) {
        console.error('[Map] ❌ Error al crear el mapa:', error);
        console.error('[Map] Stack:', error.stack);
        return;
    }
    
    console.log('[Map] Registrando event listeners de geolocalización...');
    // Registrar event listeners de geolocalización DESPUÉS de crear el mapa
    map.on('locationfound', (e) => {
        const latlng = e.latlng;
        const now = Date.now();
        
        // Throttle: Usar intervalo adaptativo según si estamos siguiendo
        const updateInterval = follow ? 500 : MIN_UPDATE_INTERVAL;  // 500ms si follow=true, 3000ms si follow=false
        if (now - lastLocationUpdate < updateInterval) {
            return;
        }
        
        // Calcular distancia desde la última posición registrada
        let distanceChanged = MIN_DISTANCE_CHANGE + 1;
        if (lastPositionLogged) {
            const dx = (latlng.lat - lastPositionLogged.lat) * 111000; // aproximadamente metros en latitud
            const dy = (latlng.lng - lastPositionLogged.lng) * 111000 * Math.cos(latlng.lat * Math.PI / 180); // metros en longitud
            distanceChanged = Math.sqrt(dx * dx + dy * dy);
        }
        
        // Solo loguear si cambió significativamente o pasó tiempo suficiente
        if (now - lastLogTime > MIN_LOG_INTERVAL || distanceChanged > MIN_DISTANCE_CHANGE) {
            console.log('[Map] 📍 Ubicación:', `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`, `(${distanceChanged.toFixed(0)}m)`);
            lastLogTime = now;
        }
        
        lastLocationUpdate = now;
        lastPositionLogged = latlng;

        if (!youMarker) {
            // Usar el último heading conocido del dispositivo si está disponible
            const initialIconAngle = (lastDeviceHeading != null) ? lastDeviceHeading : (headingDeg ?? 0);
            youMarker = L.marker(latlng, {
                icon: makeHeadingIcon(initialIconAngle), 
                zIndexOffset: 1000
            }).addTo(map);
            // Guardar el ángulo base del marcador para calcular correcciones posteriores
            markerInitialMapAngle = initialIconAngle;
            deviceToMarkerOffset = null; // resetear offset cuando se crea un nuevo marcador
            console.log('[Map] ✓ Marcador de usuario creado con icono de flecha (ángulo inicial: ' + initialIconAngle + '°)');
        } else {
            youMarker.setLatLng(latlng);
            // Actualizar el ícono basado en la precisión
            const accuracy = e.accuracy || 50;
            if (accuracy < 50) {
                // Buena precisión: actualizar icono con el último heading conocido
                const iconAngle = (lastDeviceHeading != null) ? lastDeviceHeading : (headingDeg ?? 0);
                youMarker.setIcon(makeHeadingIcon(iconAngle));
            }
            const el = youMarker.getElement()?.querySelector('svg');
            if (el) {
                const rot = (lastDeviceHeading != null) ? lastDeviceHeading : (headingDeg ?? 0);
                el.style.transform = `rotate(${rot}deg)`;
            }
        }

        if (!accuracyCircle) {
            accuracyCircle = L.circle(latlng, {
                radius: e.accuracy || 15,
                weight: 3,
                color: '#0d47a1',
                opacity: 0.9,
                fill: true,
                fillColor: '#1976d2',
                fillOpacity: 0.15
            }).addTo(map);
            console.log('[Map] ✓ Círculo de precisión creado, radio:', e.accuracy);
        } else {
            accuracyCircle.setLatLng(latlng);
            accuracyCircle.setRadius(e.accuracy || 15);
        }

        // IMPORTANTE: Solo mover el mapa si follow está activado
        if (follow) {
            map.setView(latlng, Math.max(map.getZoom(), 16), { animate: false });
        }

        checkOffRoute(latlng);
        updateLocateVisibility();
    });

    map.on('locationerror', (e) => {
        console.error('[Map] ❌ Error de ubicación:', e);
        showBanner('⚠️ No se pudo obtener ubicación');
    });
    // Actualizar visibilidad del botón 'Mi ubicación' cuando el usuario interactúa con el mapa
    map.on('moveend', updateLocateVisibility);
    map.on('zoomend', updateLocateVisibility);
    
    mapInitialized = true;
    console.log('[Map] ✓✓✓ MAPA INICIALIZADO EXITOSAMENTE ✓✓✓');
    
    // Cargar datos una vez inicializado
    console.log('[Map] Cargando puntos de interés y ruta...');
    loadInterestPoints();
    loadCurrentRoute();
    console.log('[Map] ========== FIN INICIALIZACIÓN ==========');
}

// ----- MAPA BASE -----

// ----- CARGAR PUNTOS DE INTERÉS -----
async function loadInterestPoints(lang = 'es') {
    try {
        const fileName = getBasePath() + `data/points/points-${lang}.json`;
        console.log('Cargando puntos de interés desde:', fileName);
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

    const gpxFile = getBasePath() + `data/gpx/${routeName}.gpx`;
    console.log('Cargando GPX desde:', gpxFile);

    gpxLayer = new L.GPX(gpxFile, {
        async: true,
        marker_options: {
            startIconUrl: false,
            endIconUrl: false,
            shadowUrl: false,
            icon: L.divIcon({
                className: 'hidden-marker',
                html: '',
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            })
        },
        polyline_options: { color: '#2563eb', weight: 4, opacity: .95 }
    })
        .on('loaded', e => {
            console.log('Ruta ' + routeName + ' cargada correctamente');

            // Remover TODOS los marcadores que haya creado el plugin
            const markersToRemove = [];
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    markersToRemove.push(layer);
                }
            });
            markersToRemove.forEach(marker => map.removeLayer(marker));
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
            document.getElementById('btnStart').textContent = '🚀 INICIAR';
        }

        // Cargar la nueva ruta
        loadGPXRoute(currentRoute);
        hideCelebrationMessage();
        hideInitialMessage();
        showInitialMessage();

        showBanner('Ruta cambiada a ' + e.target.options[e.target.selectedIndex].text);
    });
}

// ----- BOTÓN INICIAR/DETENER -----
const btnStart = document.getElementById('btnStart');
if (!btnStart) {
    console.error('[Map] ❌ CRÍTICO: btnStart no encontrado en el HTML');
} else {
    btnStart.addEventListener('click', function () {
        console.log('[Map] btnStart click - routeStarted=', routeStarted);
        
        // Inicializar mapa si no está hecho
        if (!mapInitialized) {
            console.log('[Map] Inicializando mapa...');
            initializeMap();
        }
        
        if (!routeStarted) {
            // ===== INICIAR TREKKING =====
            routeStarted = true;
            setFollow(true);  // ACTIVAR SEGUIMIENTO
            this.classList.add('active');
            this.textContent = '⏹️ DETENER';
            console.log('[Map] Trekking iniciado - follow=true');
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
                    console.log('[Map] Ruta enfocada');
                } catch (e) { 
                    console.log('[Map] No se pudo enfocar ruta:', e);
                }
            }

            // Activar geolocalización automáticamente
            if (map) {
                console.log('[Map] Inicializando geolocalización con watch=true para seguimiento continuo');
                map.locate({ watch: true, setView: true, maxZoom: 17, enableHighAccuracy: true, timeout: 10000 });
            }
            
            // Activar automáticamente el sensor de orientación
            enableCompass();
            
        } else {
            // ===== DETENER TREKKING =====
            routeStarted = false;
            setFollow(false);  // DESACTIVAR SEGUIMIENTO
            this.classList.remove('active');
            this.textContent = '🚀 INICIAR';
            console.log('[Map] Trekking detenido - follow=false');
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
}

// ----- GEOLOC: "MI UBICACIÓN" - Mover el mapa UNA SOLA VEZ -----
const btnLocate = document.getElementById('btnLocate');
if (btnLocate) {
    btnLocate.addEventListener('click', () => {
        if (!mapInitialized) {
            initializeMap();
        }
        if (map) {
            // setView: true hace que se centre una sola vez
            // watch: false significa que solo solicita ubicación actual, no continuamente
            map.locate({ watch: false, setView: true, maxZoom: 17, enableHighAccuracy: true, timeout: 10000 });
            
            // Habilitar automáticamente la brújula al hacer click en "Mi ubicación"
            console.log('[Map] Habilitando brújula automáticamente...');
            enableCompass();
            // Actualizar visibilidad del botón después de centrar
            setTimeout(updateLocateVisibility, 400);
        }
    });
} else {
    console.warn('[Map] ⚠️ btnLocate no encontrado en el HTML');
}

// Event listeners de geolocalización movidos a initializeMap()

// ----- BRÚJULA -----
function handleOrientation(ev) {
    // Determinar el heading absoluto del dispositivo (grados desde el norte, horario)
    const rawAlpha = (typeof ev.webkitCompassHeading === 'number') ? ev.webkitCompassHeading : ev.alpha;
    if (typeof rawAlpha === 'number') {
        const deviceHeading = rawAlpha % 360;

        // Aplicar directamente el heading del dispositivo en cada evento para rotación en vivo.
        lastDeviceHeading = deviceHeading;
        headingDeg = deviceHeading;

        const el = youMarker?.getElement()?.querySelector('svg');
        if (el) {
            el.style.transform = `rotate(${headingDeg}deg)`;
        }
        console.log('[Compass] deviceHeading:', deviceHeading.toFixed(1) + '° → aplicando rotación:', headingDeg.toFixed(1) + '°');
    }
}

async function enableCompass() {
    try {
        // Resetear el ángulo inicial para capturar el nuevo ángulo de referencia
        initialHeading = null;
        
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            const state = await DeviceOrientationEvent.requestPermission();
            if (state !== 'granted') {
                showBanner('⚠️ Permiso de brújula denegado');
                return;
            }
        }
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        showBanner('🧲 Brújula activada');
        console.log('[Compass] Brújula habilitada - esperando ángulo inicial...');
    } catch (error) {
        console.error('[Compass] Error al habilitar brújula:', error);
        showBanner('⚠️ Brújula no disponible en este navegador');
    }
}
// Asignar evento de Brújula si el botón existe
const btnCompass = document.getElementById('btnCompass');
if (btnCompass) {
    console.log('[Map] btnCompass encontrado, agregando listener');
    btnCompass.onclick = enableCompass;
} else {
    console.warn('[Map] ⚠️ btnCompass no encontrado en el HTML');
}

// ----- TOGGLE SEGUIR -----
const btnFollow = document.getElementById('btnFollow');
if (!btnFollow) {
    console.error('[Map] ❌ CRÍTICO: btnFollow no encontrado. El seguimiento no funcionará');
} else {
    // Inicializar UI con el estado actual
    updateFollowButtonUI();

    btnFollow.onclick = (ev) => {
        setFollow(!follow);
        showBanner(follow ? "✅ Seguimiento activado - El mapa te seguirá" : "⏸️ Seguimiento desactivado - Puedes explorar el mapa");
        console.log('[Follow] Seguimiento:', follow ? 'ACTIVADO' : 'DESACTIVADO');
    };
}

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