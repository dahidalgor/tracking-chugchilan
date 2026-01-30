let guidesData = { guides: [] };

// Cargar guías desde el archivo JSON (igual que index.html)
async function loadGuides() {
    try {
        const response = await fetch('./data/guides/guides.json');
        
        if (!response.ok) {
            throw new Error(`Error cargando guías: ${response.status}`);
        }
        
        guidesData = await response.json();
        console.log('✅ Guías cargados:', guidesData.guides.length);
        updateTable();
    } catch (error) {
        console.error('Error cargando guías:', error);
        
        // Intentar ruta alternativa
        try {
            console.log('Intentando ruta alternativa...');
            const response = await fetch('/data/guides/guides.json');
            if (response.ok) {
                guidesData = await response.json();
                console.log('✅ Guías cargados desde ruta alternativa');
                updateTable();
                return;
            }
        } catch (e) {
            console.error('Error en ruta alternativa:', e);
        }
        
        // Si todo falla, usar datos de ejemplo
        guidesData = { 
            guides: [
                {
                    id: 1,
                    imgSrc: "data/img/Guias/default.jpg",
                    names: { es: "Guía de Ejemplo", en: "Example Guide", fr: "Guide Exemple", pt: "Guia Exemplo", qu: "Yachachiy" },
                    languages: { es: "Español / Inglés", en: "Spanish / English", fr: "Espagnol / Anglais", pt: "Espanhol / Inglês", qu: "Kastilla simi / Inlish simi" },
                    contact: "+593 999999999",
                    whatsapp: "https://wa.me/593999999999"
                }
            ]
        };
        
        console.log('⚠️ Usando datos de ejemplo');
        updateTable();
    }
}

// Actualizar la tabla con los datos
function updateTable() {
    const tableBody = document.querySelector('#guidesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Ordenar por ID
    guidesData.guides.sort((a, b) => a.id - b.id);
    
    guidesData.guides.forEach(guide => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guide.id}</td>
            <td>${guide.names.es}</td>
            <td>${guide.languages.es}</td>
            <td>${typeof guide.contact === 'string' ? guide.contact : guide.contact.es}</td>
            <td><a href="${guide.whatsapp}" target="_blank" class="btn btn-sm btn-success"><i class="fab fa-whatsapp"></i></a></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewGuide(${guide.id})" title="Ver"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-warning" onclick="editGuide(${guide.id})" title="Modificar"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteGuide(${guide.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para descargar el archivo JSON actualizado
function downloadJSON(data, filename = 'guides.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para crear un nuevo guía (TODO el trabajo del lado del cliente)
document.getElementById('guideForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const contactNum = document.getElementById('contact').value.replace(/\D/g, '');
    const imgSrcInput = document.getElementById('imgSrc');

    // Validaciones
    if (!name) {
        alert('Por favor ingresa el nombre del guía');
        return;
    }

    if (!contactNum || contactNum.length < 9) {
        alert('Por favor ingresa un número de contacto válido (mínimo 9 dígitos)');
        return;
    }

    // Validar imagen
    const base64Image = imgSrcInput.dataset.file;
    if (!base64Image) {
        alert('Por favor selecciona una imagen');
        return;
    }

    // Recoger idiomas seleccionados
    const selectedLangs = [];
    const langCheckboxes = ['langEsp', 'langIng', 'langFra', 'langPor', 'langQue'];
    langCheckboxes.forEach(id => {
        if (document.getElementById(id).checked) {
            selectedLangs.push(document.getElementById(id).value);
        }
    });
    if (selectedLangs.length === 0) {
        alert('Selecciona al menos un idioma');
        return;
    }

    // Traducciones
    const langTranslations = {
        es: { 'Español': 'Español', 'Inglés': 'Inglés', 'Francés': 'Francés', 'Portugués': 'Portugués', 'Quechua': 'Quechua' },
        en: { 'Español': 'Spanish', 'Inglés': 'English', 'Francés': 'French', 'Portugués': 'Portuguese', 'Quechua': 'Quechua' },
        fr: { 'Español': 'Espagnol', 'Inglés': 'Anglais', 'Francés': 'Français', 'Portugués': 'Portugais', 'Quechua': 'Quechua' },
        pt: { 'Español': 'Espanhol', 'Inglés': 'Inglês', 'Francés': 'Francês', 'Portugués': 'Português', 'Quechua': 'Quíchua' },
        qu: { 'Español': 'Kastilla simi', 'Inglés': 'Inlish simi', 'Francés': 'Ransis simi', 'Portugués': 'Purtugis simi', 'Quechua': 'Runasimi' }
    };

    const translatedLangs = {};
    Object.keys(langTranslations).forEach(lang => {
        translatedLangs[lang] = selectedLangs.map(l => langTranslations[lang][l]).join(' / ');
    });

    // Generar nuevo ID
    const newId = guidesData.guides.length > 0 
        ? Math.max(...guidesData.guides.map(g => g.id)) + 1 
        : 1;

    // Usar imagen en base64 temporalmente
    const imagePath = base64Image;

    // Crear nuevo guía
    const newGuide = {
        id: newId,
        imgSrc: imagePath,
        names: {
            es: name,
            en: name,
            fr: name,
            pt: name,
            qu: name
        },
        languages: translatedLangs,
        contact: '+593 ' + contactNum,
        whatsapp: 'https://wa.me/593' + contactNum
    };

    // Agregar al array
    guidesData.guides.push(newGuide);
    
    // Actualizar tabla
    updateTable();
    
    // Crear archivo para descargar
    downloadJSON({ guides: guidesData.guides }, 'guides_updated.json');
    
    alert('✅ Guía creado exitosamente. Se ha generado el archivo "guides_updated.json" para descargar.');
    
    closeFormModal();
});

// Ver guía (sin cambios)
window.viewGuide = function (id) {
    const guide = guidesData.guides.find(g => g.id === id);
    if (guide) {
        document.getElementById('viewId').textContent = guide.id;
        document.getElementById('viewName').textContent = guide.names.es;
        document.getElementById('viewImg').src = guide.imgSrc;
        document.getElementById('viewLanguages').textContent = guide.languages.es;
        document.getElementById('viewContact').textContent = typeof guide.contact === 'string' ? guide.contact : guide.contact.es;
        document.getElementById('viewWhatsapp').href = guide.whatsapp;
        document.getElementById('viewWhatsapp').textContent = 'Abrir WhatsApp';
        document.getElementById('viewModal').style.display = 'block';
    }
}

// Editar guía (actualiza localmente)
window.editGuide = function (id) {
    const guide = guidesData.guides.find(g => g.id === id);
    if (guide) {
        document.getElementById('editId').value = guide.id;
        document.getElementById('editImgSrc').value = guide.imgSrc;
        document.getElementById('editName').value = guide.names.es;
        
        // Extraer número de contacto
        let contactNum = guide.contact;
        if (typeof contactNum === 'string') {
            contactNum = contactNum.replace('+593 ', '').replace(/\D/g, '');
        } else {
            contactNum = '';
        }
        document.getElementById('editContact').value = contactNum;

        // Mostrar imagen actual
        const preview = document.getElementById('editImagePreview');
        preview.src = guide.imgSrc;
        preview.style.display = 'block';

        // Limpiar y marcar idiomas
        const editLangCheckboxes = ['editLangEsp', 'editLangIng', 'editLangFra', 'editLangPor', 'editLangQue'];
        editLangCheckboxes.forEach(cb => {
            document.getElementById(cb).checked = false;
        });

        const langs = guide.languages.es.split(' / ');
        langs.forEach(lang => {
            if (lang === 'Español' || lang === 'Spanish' || lang === 'Espagnol' || lang === 'Espanhol' || lang === 'Kastilla simi') {
                document.getElementById('editLangEsp').checked = true;
            }
            if (lang === 'Inglés' || lang === 'English' || lang === 'Anglais' || lang === 'Inglês' || lang === 'Inlish simi') {
                document.getElementById('editLangIng').checked = true;
            }
            if (lang === 'Francés' || lang === 'French' || lang === 'Français' || lang === 'Francês' || lang === 'Ransis simi') {
                document.getElementById('editLangFra').checked = true;
            }
            if (lang === 'Portugués' || lang === 'Portuguese' || lang === 'Portugais' || lang === 'Português' || lang === 'Purtugis simi') {
                document.getElementById('editLangPor').checked = true;
            }
            if (lang === 'Quechua' || lang === 'Quíchua' || lang === 'Runasimi') {
                document.getElementById('editLangQue').checked = true;
            }
        });

        document.getElementById('editModal').style.display = 'block';
    }
}

// Eliminar guía
window.deleteGuide = async function (id) {
    const t = (k) => (window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][k]) || k;
    if (confirm(t('confirmDeleteGuide'))) {
        const index = guidesData.guides.findIndex(g => g.id === id);
        if (index !== -1) {
            guidesData.guides.splice(index, 1);
            updateTable();
            alert(t('alertGuideDeleted'));
        }
    }
}

// Guardar cambios al editar
document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value.trim();
    const contactNum = document.getElementById('editContact').value.replace(/\D/g, '');
    
    // Validaciones
    if (!name) {
        alert('Por favor ingresa el nombre del guía');
        return;
    }

    if (!contactNum || contactNum.length < 9) {
        alert('Por favor ingresa un número de contacto válido');
        return;
    }

    // Buscar guía
    const guideIndex = guidesData.guides.findIndex(g => g.id === id);
    if (guideIndex === -1) {
        alert('Guía no encontrado');
        return;
    }

    // Validar idiomas
    const selectedLangs = [];
    const langCheckboxes = ['editLangEsp', 'editLangIng', 'editLangFra', 'editLangPor', 'editLangQue'];
    langCheckboxes.forEach(cb => {
        if (document.getElementById(cb).checked) {
            selectedLangs.push(document.getElementById(cb).value);
        }
    });
    if (selectedLangs.length === 0) {
        alert('Selecciona al menos un idioma');
        return;
    }

    // Traducciones
    const langTranslations = {
        es: { 'Español': 'Español', 'Inglés': 'Inglés', 'Francés': 'Francés', 'Portugués': 'Portugués', 'Quechua': 'Quechua' },
        en: { 'Español': 'Spanish', 'Inglés': 'English', 'Francés': 'French', 'Portugués': 'Portuguese', 'Quechua': 'Quechua' },
        fr: { 'Español': 'Espagnol', 'Inglés': 'Anglais', 'Francés': 'Français', 'Portugués': 'Portugais', 'Quechua': 'Quechua' },
        pt: { 'Español': 'Espanhol', 'Inglés': 'Inglês', 'Francés': 'Francês', 'Portugués': 'Português', 'Quechua': 'Quíchua' },
        qu: { 'Español': 'Kastilla simi', 'Inglés': 'Inlish simi', 'Francés': 'Ransis simi', 'Portugués': 'Purtugis simi', 'Quechua': 'Runasimi' }
    };

    const translatedLangs = {};
    Object.keys(langTranslations).forEach(lang => {
        translatedLangs[lang] = selectedLangs.map(l => langTranslations[lang][l]).join(' / ');
    });

    // Actualizar guía
    const imgSrcInput = document.getElementById('editImgSrc');
    let imgPath = guidesData.guides[guideIndex].imgSrc;
    
    // Si hay nueva imagen, usar base64
    const base64Image = imgSrcInput.dataset.file;
    if (base64Image) {
        imgPath = base64Image;
    }

    guidesData.guides[guideIndex] = {
        id: id,
        imgSrc: imgPath,
        names: {
            es: name,
            en: name,
            fr: name,
            pt: name,
            qu: name
        },
        languages: translatedLangs,
        contact: '+593 ' + contactNum,
        whatsapp: 'https://wa.me/593' + contactNum
    };

    // Actualizar tabla
    updateTable();
    
    // Crear archivo para descargar
    downloadJSON({ guides: guidesData.guides }, 'guides_updated.json');
    
    closeEditModal();
    alert('✅ Guía modificado exitosamente. Se ha generado el archivo "guides_updated.json" para descargar.');
});

// Funciones para manejar archivos (sin cambios)
function setupDropZone(dropZoneId, fileInputId, previewId, hiddenInputId, fileSelectId) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const hiddenInput = document.getElementById(hiddenInputId);
    const fileSelect = document.getElementById(fileSelectId);

    if (!dropZone || !fileInput || !preview || !hiddenInput || !fileSelect) {
        console.error('Elementos del drop zone no encontrados');
        return;
    }

    dropZone.addEventListener('click', () => fileInput.click());
    fileSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0], preview, hiddenInput);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0], preview, hiddenInput);
        }
    });
}

function handleFile(file, preview, hiddenInput) {
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen (JPG, PNG, etc.).');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        hiddenInput.dataset.file = e.target.result;
        hiddenInput.dataset.fileName = file.name;
        preview.src = e.target.result;
        preview.style.display = 'block';
        preview.alt = 'Vista previa de la imagen';
    };
    reader.onerror = function() {
        alert('Error al leer el archivo. Por favor intenta con otra imagen.');
    };
    reader.readAsDataURL(file);
}

// Funciones para cerrar modales (sin cambios)
window.closeViewModal = function () {
    document.getElementById('viewModal').style.display = 'none';
}

window.closeFormModal = function () {
    const modal = document.getElementById('guideModal');
    if (modal) {
        modal.style.display = 'none';
    }
    const form = document.getElementById('guideForm');
    if (form) {
        form.reset();
    }
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    const imgSrcInput = document.getElementById('imgSrc');
    if (imgSrcInput) {
        imgSrcInput.dataset.file = '';
        imgSrcInput.dataset.fileName = '';
    }
    
    const langCheckboxes = ['langEsp', 'langIng', 'langFra', 'langPor', 'langQue'];
    langCheckboxes.forEach(id => {
        const cb = document.getElementById(id);
        if (cb) cb.checked = false;
    });
}

window.closeEditModal = function () {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    }
    const form = document.getElementById('editForm');
    if (form) {
        form.reset();
    }
    const preview = document.getElementById('editImagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    const imgSrcInput = document.getElementById('editImgSrc');
    if (imgSrcInput) {
        imgSrcInput.dataset.file = '';
        imgSrcInput.dataset.fileName = '';
    }
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    setupDropZone('dropZone', 'imgFile', 'imagePreview', 'imgSrc', 'fileSelect');
    setupDropZone('editDropZone', 'editImgFile', 'editImagePreview', 'editImgSrc', 'editFileSelect');
    
    const createGuideBtn = document.getElementById('createGuideBtn');
    if (createGuideBtn) {
        createGuideBtn.addEventListener('click', () => {
            document.getElementById('guideModal').style.display = 'block';
        });
    }
    
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeFormModal);
    }
    
    loadGuides();
    // Cargar solicitudes de registro de guías (desde localStorage)
    renderGuideRequests();
});

// Cargar y mostrar solicitudes de guía guardadas en localStorage
function getGuideRequests() {
    try {
        return JSON.parse(localStorage.getItem('guide_requests') || '[]');
    } catch (e) {
        return [];
    }
}

function saveGuideRequests(list) {
    localStorage.setItem('guide_requests', JSON.stringify(list));
}

function markRequestReviewed(id) {
    const list = getGuideRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
        list[idx].status = 'reviewed';
        saveGuideRequests(list);
        renderGuideRequests();
    }
}

function renderGuideRequests() {
    const container = document.getElementById('requestsContainer');
    if (!container) return;
    const requests = getGuideRequests().sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    container.innerHTML = '';
    if (requests.length === 0) {
        container.innerHTML = '<p>No hay solicitudes pendientes.</p>';
        return;
    }

    requests.forEach(req => {
        const el = document.createElement('div');
        el.className = 'request-card';
        el.style.border = '1px solid #e6e6e6';
        el.style.padding = '10px';
        el.style.borderRadius = '8px';
        el.style.marginBottom = '8px';
        if (req.status === 'new') {
            el.style.background = '#fffbea';
            el.style.borderColor = '#f6d365';
        }

                el.innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                            <div>
                                <strong>${req.firstName} ${req.lastName}</strong>
                                ${req.status === 'new' ? '<span style="background:#ff3b30;color:white;padding:2px 8px;border-radius:12px;margin-left:8px;font-size:12px;">NUEVO</span>' : ''}
                                <div style="color:#555;margin-top:6px;">Idiomas: ${Array.isArray(req.languages)? req.languages.join(' / '): req.languages}</div>
                                <div style="color:#555;margin-top:6px;">WhatsApp: <a href="https://wa.me/${req.whatsapp.replace(/\D/g,'')}" target="_blank">${req.whatsapp}</a></div>
                                <div style="color:#555;margin-top:6px;">Correo: ${req.email}</div>
                                <div style="color:#888;margin-top:6px;font-size:12px;">Enviado: ${new Date(req.createdAt).toLocaleString()}</div>
                            </div>
                            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
                                <div style="display:flex;flex-direction:column;gap:6px;">
                                    <button class="btn btn-sm btn-primary" onclick="markRequestReviewed(${req.id})">Marcar como revisado</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteRequest(${req.id})">Eliminar</button>
                                </div>
                            </div>
                        </div>
                `;

        container.appendChild(el);
    });
}

// Eliminar solicitud de guía
window.deleteRequest = function(id) {
    const t = (k) => (window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][k]) || k;
    if (!confirm(t('confirmDeleteRequest'))) return;
    const list = getGuideRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        saveGuideRequests(list);
        renderGuideRequests();
        alert(t('alertRequestDeleted'));
    }
}

// Manejar clics fuera de los modales
window.onclick = function(event) {
    const modals = ['guideModal', 'viewModal', 'editModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target == modal) {
            if (modalId === 'guideModal') closeFormModal();
            if (modalId === 'viewModal') closeViewModal();
            if (modalId === 'editModal') closeEditModal();
        }
    });
};