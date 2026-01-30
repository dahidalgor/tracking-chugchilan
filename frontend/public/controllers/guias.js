
// Detectar la ruta base correcta
function getBasePath() {
    const currentPath = window.location.pathname;
    // Si estamos en /public/... o en /... en distribución
    if (currentPath.includes('/public/')) {
        return './';
    }
    return './';
}

// Datos de los guías - se cargarán desde guides.json
let guidesData = {};

// Variables globales
let currentLanguage = 'es';
let currentGuideId = null;
const modal = document.getElementById('guideModal');

// Función para cargar guías desde la API
async function loadGuides() {
  try {
    const url = getBasePath() + 'data/guides/guides.json';
    console.log('Cargando guías desde:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    guidesData = {};
    data.guides.forEach(guide => {
      guidesData[guide.id] = guide;
    });

    console.log('Guías cargadas:', Object.keys(guidesData).length);

    // Generar tarjetas dinámicamente
    generateGuideCards();

    // Una vez generadas, configurar event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Error cargando guías:', error);
  }
}

async function loadGuidesIndex() {
  
}

// Función para generar las tarjetas de guías
function generateGuideCards() {
  const container = document.getElementById('guideContainer');
  if (!container) return;

  container.innerHTML = ''; // Limpiar contenedor

  Object.values(guidesData).forEach(guide => {
    const card = document.createElement('div');
    card.className = 'gallery-card guide-card';
    card.setAttribute('data-guide-id', guide.id);
    card.innerHTML = `
      <div class="gallery-image-wrapper">
        <img src="${guide.imgSrc}" alt="Guía ${guide.id}" class="gallery-image">
      </div>
      <div class="gallery-content">
        <h3 class="gallery-title">${guide.names.es || 'Guía'}</h3>
        <p class="gallery-description">${guide.languages.es || ''}</p>
        <div class="gallery-meta">
          <span class="gallery-icon">📱</span>
          <span class="gallery-text">${guide.contact || ''}</span>
        </div>
        <a href="${guide.whatsapp || '#'}" class="gallery-button" target="_blank" rel="noopener">Contactar</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Función para configurar event listeners
function setupEventListeners() {
  const guideCards = document.querySelectorAll('.guide-card');
  // Event listeners para abrir el modal al hacer clic en una tarjeta
  guideCards.forEach(card => {
    card.addEventListener('click', () => {
      const guideId = parseInt(card.getAttribute('data-guide-id'));
      openModal(guideId);
    });
  });

  // Event listener para cerrar el modal
  const closeModalBtn = document.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Cerrar modal al hacer clic fuera del contenido
  const modal = document.getElementById('guideModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Cerrar modal con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
}

// Función para obtener datos del guía según idioma
function getGuideData(guideId, lang = currentLanguage) {
  const guide = guidesData[guideId];
  if (!guide) return null;

  return {
    imgSrc: guide.imgSrc,
    name: guide.names[lang] || guide.names.es,
    languages: guide.languages[lang] || guide.languages.es,
    contact: typeof guide.contact === 'object' ? guide.contact[lang] || guide.contact.es : guide.contact,
    whatsapp: guide.whatsapp
  };
}

// Función para actualizar las etiquetas del modal según idioma
function updateModalLabels(lang = currentLanguage) {
  const modalTitle = document.getElementById('modalGuideTitle');
  const languagesLabel = document.getElementById('modalLanguagesLabel');
  const contactLabel = document.getElementById('modalContactLabel');

  const labels = {
    es: {
      modalTitle: 'GUÍA LOCAL',
      languagesLabel: 'Idiomas',
      contactLabel: 'Contacto'
    },
    en: {
      modalTitle: 'LOCAL GUIDE',
      languagesLabel: 'Languages',
      contactLabel: 'Contact'
    },
    fr: {
      modalTitle: 'GUIDE LOCAL',
      languagesLabel: 'Langues',
      contactLabel: 'Contact'
    },
    pt: {
      modalTitle: 'GUIA LOCAL',
      languagesLabel: 'Idiomas',
      contactLabel: 'Contato'
    },
    qu: {
      modalTitle: 'LLAQTAMANTA YACHAQ',
      languagesLabel: 'Simikuna',
      contactLabel: 'Rimay'
    }
  };

  if (modalTitle) modalTitle.textContent = labels[lang]?.modalTitle || labels.es.modalTitle;
  if (languagesLabel) languagesLabel.textContent = labels[lang]?.languagesLabel || labels.es.languagesLabel;
  if (contactLabel) contactLabel.textContent = labels[lang]?.contactLabel || labels.es.contactLabel;
}

// Función para abrir el modal
function openModal(guideId) {
  currentGuideId = guideId;
  const guide = getGuideData(guideId, currentLanguage);

  if (!guide) return;

  // Llenar el modal con la información del guía
  document.getElementById('modalGuideImg').src = guide.imgSrc;
  document.getElementById('modalGuideImg').alt = guide.name;
  document.getElementById('modalGuideName').textContent = guide.name;
  document.getElementById('modalGuideLanguages').textContent = guide.languages;
  document.getElementById('modalGuideContact').textContent = guide.contact;

  // Configurar el botón de contacto
  const contactBtn = document.getElementById('modalGuideContactBtn');
  if (guide.whatsapp && guide.whatsapp !== '#') {
    contactBtn.href = guide.whatsapp;
    updateContactButtonText(currentLanguage, 'whatsapp');
    contactBtn.classList.remove('email');
  } else {
    contactBtn.href = 'mailto:info@quilotoatrail.com';
    updateContactButtonText(currentLanguage, 'email');
    contactBtn.classList.add('email');
  }

  // Actualizar etiquetas del modal
  updateModalLabels(currentLanguage);

  // Mostrar el modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Función para actualizar texto del botón de contacto
function updateContactButtonText(lang, type) {
  const contactBtn = document.getElementById('modalGuideContactBtn');
  if (!contactBtn) return;

  const texts = {
    es: {
      whatsapp: 'Contactar por WhatsApp',
      email: 'Contactar por correo'
    },
    en: {
      whatsapp: 'Contact via WhatsApp',
      email: 'Contact via email'
    },
    fr: {
      whatsapp: 'Contacter par WhatsApp',
      email: 'Contacter par email'
    },
    pt: {
      whatsapp: 'Contactar por WhatsApp',
      email: 'Contactar por email'
    },
    qu: {
      whatsapp: 'WhatsAppwan rimay',
      email: 'Correowan rimay'
    }
  };

  contactBtn.textContent = texts[lang]?.[type] || texts.es[type];
}

// Función para actualizar el modal cuando cambia el idioma
function updateModalForLanguage(lang) {
  if (currentGuideId) {
    const guide = getGuideData(currentGuideId, lang);

    if (guide) {
      document.getElementById('modalGuideName').textContent = guide.name;
      document.getElementById('modalGuideLanguages').textContent = guide.languages;
      document.getElementById('modalGuideContact').textContent = guide.contact;

      // Actualizar etiquetas del modal
      updateModalLabels(lang);

      // Actualizar botón de contacto
      const contactBtn = document.getElementById('modalGuideContactBtn');
      if (guide.whatsapp && guide.whatsapp !== '#') {
        updateContactButtonText(lang, 'whatsapp');
      } else {
        updateContactButtonText(lang, 'email');
      }
    }
  }
}

// Función para cerrar el modal
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Cargar guías al inicio
loadGuides();