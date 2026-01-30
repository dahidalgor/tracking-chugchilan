// controllers/dataLoader.js - VERSIÓN CON AUTOPLAY DINÁMICO Y 75/25

// Detectar la ruta base correcta
function getBasePath() {
    const currentPath = window.location.pathname;
    // Si estamos en /public/... o en /... en distribución
    if (currentPath.includes('/public/')) {
        return './';
    }
    return './';
}

const BASE_PATH = getBasePath();

let currentLang = 'es';
let activitiesData = [];
let lodgingsData = [];
let coverflowInstances = {};

export function setCurrentLanguage(lang) {
    currentLang = lang;
    if (activitiesData.length > 0) {
        renderActivitiesWithCoverflow();
    }
    if (lodgingsData.length > 0) {
        renderLodgingsWithCoverflow();
    }
}

export async function loadActivities() {
    try {
        console.log('Cargando actividades desde:', BASE_PATH + 'data/activity/activity.json');
        const response = await fetch(BASE_PATH + 'data/activity/activity.json');
        if (!response.ok) throw new Error('Error cargando actividades');
        const data = await response.json();
        activitiesData = data.activities;
        console.log('Actividades cargadas:', activitiesData.length);
        renderActivitiesWithCoverflow();
    } catch (error) {
        console.error('Error:', error);
        activitiesData = getFallbackActivities();
        renderActivitiesWithCoverflow();
    }
}

export async function loadLodgings() {
    try {
        console.log('Cargando hospedajes desde:', BASE_PATH + 'data/lodging/lodging.json');
        const response = await fetch(BASE_PATH + 'data/lodging/lodging.json');
        if (!response.ok) throw new Error('Error cargando hospedajes');
        const data = await response.json();
        lodgingsData = data.lodgings;
        console.log('Hospedajes cargados:', lodgingsData.length);
        renderLodgingsWithCoverflow();
    } catch (error) {
        console.error('Error:', error);
        lodgingsData = getFallbackLodgings();
        renderLodgingsWithCoverflow();
    }
}

function renderActivitiesWithCoverflow() {
    const container = document.getElementById('activityContainer');
    if (!container || activitiesData.length === 0) return;

    container.innerHTML = '';
    container.className = 'gallery';
    
    activitiesData.forEach((activity, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        const description = activity.description?.[currentLang] || activity.description?.es || '';
        const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
        
        card.innerHTML = `
            <div class="gallery-image-wrapper">
                <img src="${activity.imgSrc}" 
                     alt="${activity.alt?.[currentLang] || activity.alt?.es || 'Actividad'}"
                     class="gallery-image">
            </div>
            <div class="gallery-content">
                <h3 class="gallery-title">${activity.title?.[currentLang] || activity.title?.es || 'Actividad'}</h3>
                <p class="gallery-description">${shortDescription}</p>
                <div class="gallery-meta">
                    <span class="gallery-icon">⏰</span>
                    <span class="gallery-text">${activity.schedule?.[currentLang] || activity.schedule?.es || ''}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function renderLodgingsWithCoverflow() {
    const container = document.getElementById('lodgingContainer');
    if (!container || lodgingsData.length === 0) return;

    container.innerHTML = '';
    container.className = 'gallery';
    
    lodgingsData.forEach((lodging, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        const description = lodging.description?.[currentLang] || lodging.description?.es || '';
        const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
        
        card.innerHTML = `
            <div class="gallery-image-wrapper">
                <img src="${lodging.imgSrc}" 
                     alt="${lodging.alt?.[currentLang] || lodging.alt?.es || 'Hospedaje'}"
                     class="gallery-image">
            </div>
            <div class="gallery-content">
                <h3 class="gallery-title">${lodging.title?.[currentLang] || lodging.title?.es || 'Hospedaje'}</h3>
                <p class="gallery-description">${shortDescription}</p>
                <div class="gallery-meta">
                    <span class="gallery-icon">📞</span>
                    <a href="tel:${lodging.phone}" class="gallery-link">${lodging.phone || 'Llamar'}</a>
                </div>
                <a href="${lodging.url}" target="_blank" rel="noopener" class="gallery-button">Reservar</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function initCoverflowNavigation(containerId) {
    // Ya no se usa - la galería es estática
}

// Datos de fallback
function getFallbackActivities() {
    return [
        {
            id: 1,
            imgSrc: "data/img/Actividades/Actividad1.jpg",
            title: { es: "Granja de Animales Andina" },
            description: { es: "Interactúa con llamas, alpacas y cuyes. Aprende sobre crianza tradicional andina en los Andes." },
            schedule: { es: "Lun-Sáb: 9:00-16:00" },
            alt: { es: "Granja de animales" }
        }
    ];
}

function getFallbackLodgings() {
    return [
        {
            id: 1,
            imgSrc: "https://quilotoatrail.com/wp-content/uploads/2024/07/DSC_2355-min32-2-1024x683.jpg",
            title: { es: "Hostal Cloud Forest" },
            description: { es: "Refugio acogedor en bosque nublado con vista panorámica y chimenea." },
            schedule: { es: "Check-in: 14:00-20:00" },
            phone: "+593 99 123 4567",
            alt: { es: "Hostal Cloud Forest" },
            url: "https://quilotoatrail.com/admin/establecimiento.php?id=10"
        }
    ];
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando dataLoader...');
    loadActivities();
    loadLodgings();
});

// Exportar para control global
window.dataLoader = {
    loadActivities,
    loadLodgings,
    setCurrentLanguage,
    coverflowInstances
};