// Datos de los guías traducibles por idioma
const guidesData = {
  1: {
    imgSrc: './data/img/Guias/Guia1.jpg',
    names: {
      es: 'NEGRETE USUÑO VICTOR EDWIN',
      en: 'VICTOR EDWIN NEGRETE USUÑO',
      fr: 'VICTOR EDWIN NEGRETE USUÑO',
      pt: 'VICTOR EDWIN NEGRETE USUÑO',
      qu: 'VICTOR EDWIN NEGRETE USUÑO'
    },
    languages: {
      es: 'Español',
      en: 'Spanish',
      fr: 'Espagnol',
      pt: 'Espanhol',
      qu: 'Kastilla simi'
    },
    contact: '+593 99 092 7095',
    whatsapp: 'https://wa.me/593990927095'
  },
  2: {
    imgSrc: 'https://ecuadorconventions.org/wp-content/uploads/2025/01/Guianza-Turistica.webp',
    names: {
      es: 'Guía Local 2',
      en: 'Local Guide 2',
      fr: 'Guide Local 2',
      pt: 'Guia Local 2',
      qu: 'Llaqtamanta yachaq 2'
    },
    languages: {
      es: 'Español / Francés',
      en: 'Spanish / French',
      fr: 'Espagnol / Français',
      pt: 'Espanhol / Francês',
      qu: 'Kastilla simi / Ransis simi'
    },
    contact: {
      es: 'Información por llenar',
      en: 'Information to be filled',
      fr: 'Information à remplir',
      pt: 'Informação a preencher',
      qu: 'Manaraq yupaychasqa willay'
    },
    whatsapp: '#'
  },
  3: {
    imgSrc: 'https://travelecuador.org/wp-content/uploads/2022/06/Marco-I-have-a-Mission.jpg',
    names: {
      es: 'Guía Local 3',
      en: 'Local Guide 3',
      fr: 'Guide Local 3',
      pt: 'Guia Local 3',
      qu: 'Llaqtamanta yachaq 3'
    },
    languages: {
      es: 'Español',
      en: 'Spanish',
      fr: 'Espagnol',
      pt: 'Espanhol',
      qu: 'Kastilla simi'
    },
    contact: {
      es: 'Información por llenar',
      en: 'Information to be filled',
      fr: 'Information à remplir',
      pt: 'Informação a preencher',
      qu: 'Manaraq yupaychasqa willay'
    },
    whatsapp: '#'
  }
};

// Variables globales
let currentLanguage = 'es';
let currentGuideId = null;
const modal = document.getElementById('guideModal');
const closeModalBtn = document.querySelector('.close-modal');
const guideCards = document.querySelectorAll('.guide-card');

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

// Event listeners para abrir el modal al hacer clic en una tarjeta
guideCards.forEach(card => {
  card.addEventListener('click', () => {
    const guideId = card.getAttribute('data-guide-id');
    openModal(guideId);
  });
});

// Event listener para cerrar el modal
closeModalBtn.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});