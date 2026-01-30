// controllers/navigation.js - Sistema de Show/Hide de Secciones

const SECTIONS = ['hospedaje', 'actividades', 'guias', 'contacto', 'creditos', 'ruta'];
const STATIC_SECTIONS = ['hero'];

let currentSection = 'hero';

function hideAllDynamicSections() {
    SECTIONS.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('oculto');
    });
}

// Función auxiliar para asegurar que el mapa cargue bien
function refreshMap() {
    console.log('[Navigation] refreshMap() llamado');
    console.log('[Navigation] window.initializeMap existe:', typeof window.initializeMap === 'function');
    
    if (typeof window.initializeMap === 'function') {
        // Pequeño delay para asegurar que el DOM esté actualizado
        console.log('[Navigation] Llamando initializeMap con 50ms delay...');
        setTimeout(() => {
            console.log('[Navigation] Ejecutando initializeMap...');
            window.initializeMap();
        }, 50);
    } else {
        console.error('[Navigation] ❌ window.initializeMap NO está disponible');
    }
}

function showSection(sectionId) {
    if (sectionId === 'hero') {
        // En Inicio: mostramos Hero + Ruta, pero subimos al tope
        hideAllDynamicSections();
        const rutaSection = document.getElementById('ruta');
        if (rutaSection) {
            rutaSection.classList.remove('oculto');
            refreshMap();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        currentSection = 'hero';
    } 
    else {
        // Para RUTA y las demás secciones:
        hideAllDynamicSections();
        const section = document.getElementById(sectionId);
        
        if (section) {
            section.classList.remove('oculto');
            currentSection = sectionId;

            // Si es la sección de ruta, refrescamos el mapa antes/durante el scroll
            if (sectionId === 'ruta') {
                refreshMap();
            }

            // Scroll idéntico para todas las secciones (Ruta, Hospedaje, Guías, etc.)
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Actualizar estado activo en el navbar
    document.querySelectorAll('.menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Navigation] ========== DOMContentLoaded ==========');
    hideAllDynamicSections();
    
    const ruta = document.getElementById('ruta');
    console.log('[Navigation] Elemento #ruta encontrado:', !!ruta);
    
    if (ruta) {
        console.log('[Navigation] Quitando clase oculto de ruta');
        ruta.classList.remove('oculto');
        console.log('[Navigation] Clase de ruta:', ruta.className);
        
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            console.log('[Navigation] Elemento #map encontrado');
            console.log('[Navigation] Map offsetHeight:', mapContainer.offsetHeight);
            console.log('[Navigation] Map offsetWidth:', mapContainer.offsetWidth);
            console.log('[Navigation] Map display:', window.getComputedStyle(mapContainer).display);
        } else {
            console.error('[Navigation] ❌ Elemento #map NO encontrado');
        }
        
        console.log('[Navigation] Llamando refreshMap con 100ms delay...');
        setTimeout(refreshMap, 100); 
    } else {
        console.error('[Navigation] ❌ Elemento #ruta NO encontrado');
    }

    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                showSection(href.substring(1));
            }
        });
    });

    const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.getAttribute('href').substring(1));
        });
    });

    if (window.dataLoader) {
        window.dataLoader.loadActivities();
        window.dataLoader.loadLodgings();
    }
    if (window.loadGuides) window.loadGuides();
});

window.navigation = {
    showSection,
    currentSection: () => currentSection
};