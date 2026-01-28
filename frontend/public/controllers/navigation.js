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
    if (typeof window.initializeMap === 'function') {
        window.initializeMap();
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
    hideAllDynamicSections();
    const ruta = document.getElementById('ruta');
    if (ruta) {
        ruta.classList.remove('oculto');
        setTimeout(refreshMap, 100); 
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