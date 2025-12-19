let guidesData = { guides: [] };
const URL = 'http://localhost:4000/';

async function loadGuides() {
    try {
        const response = await fetch(`${URL}api/guides`);
        guidesData = await response.json();
        const tableBody = document.querySelector('#guidesTable tbody');
        tableBody.innerHTML = ''; // Clear existing
        guidesData.guides.forEach(guide => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${guide.id}</td>
                        <td>${guide.names.es}</td>
                        <td>${guide.languages.es}</td>
                        <td>${typeof guide.contact === 'string' ? guide.contact : guide.contact.es}</td>
                        <td><a href="${guide.whatsapp}" target="_blank" class="btn btn-sm btn-success"><i class="fab fa-whatsapp"></i> WhatsApp</a></td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewGuide(${guide.id})" title="Ver"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-warning" onclick="editGuide(${guide.id})" title="Modificar"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteGuide(${guide.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando guías:', error);
    }
}

function addGuideToTable(guide) {
    const tableBody = document.querySelector('#guidesTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${guide.id}</td>
                <td>${guide.names.es}</td>
                <td>${guide.languages.es}</td>
                <td>${typeof guide.contact === 'string' ? guide.contact : guide.contact.es}</td>
                <td><a href="${guide.whatsapp}" target="_blank" class="btn btn-sm btn-success"><i class="fab fa-whatsapp"></i> WhatsApp</a></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewGuide(${guide.id})" title="Ver"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-warning" onclick="editGuide(${guide.id})" title="Modificar"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGuide(${guide.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            `;
    tableBody.appendChild(row);
}

document.getElementById('createGuideBtn').addEventListener('click', () => {
    document.getElementById('guideModal').style.display = 'block';
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('guideModal').style.display = 'none';
    document.getElementById('guideForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
});

document.getElementById('guideForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const contactNum = document.getElementById('contact').value.replace(/\D/g, ''); // Limpiar número
    const imgSrcInput = document.getElementById('imgSrc');

    // Validar nombre
    if (!name) {
        alert('Por favor ingresa el nombre del guía');
        return;
    }

    // Validar contacto
    if (!contactNum || contactNum.length < 9) {
        alert('Por favor ingresa un número de contacto válido');
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

    // Mapeo de traducciones
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

    try {
        // Subir imagen primero
        let imgPath;
        try {
            imgPath = await uploadImage(base64Image, imgSrcInput.dataset.fileName || 'guide-image.jpg');
        } catch (error) {
            alert('Error al subir la imagen. Por favor intenta de nuevo.');
            return;
        }

        // Crear guía con la imagen subida
        const newGuide = {
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

        const response = await fetch(`${URL}api/guides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGuide)
        });
        if (response.ok) {
            alert('¡Guía creado exitosamente!');
            loadGuides(); // Recargar la tabla
            document.getElementById('guideModal').style.display = 'none';
            document.getElementById('guideForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
        } else {
            alert('Error al crear el guía');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el guía');
    }
});

loadGuides();

// Función para configurar drop zone
function setupDropZone(dropZoneId, fileInputId, previewId, hiddenInputId, fileSelectId) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const hiddenInput = document.getElementById(hiddenInputId);
    const fileSelect = document.getElementById(fileSelectId);

    // Click to select file
    dropZone.addEventListener('click', () => fileInput.click());
    fileSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    // Drag and drop events
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

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0], preview, hiddenInput);
        }
    });
}

// Función para manejar archivo - Solo valida y muestra preview
async function handleFile(file, preview, hiddenInput) {
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen.');
        return;
    }

    // Convertir a base64 para preview local sin subir
    const reader = new FileReader();
    reader.onload = function(e) {
        // Almacenar el objeto File para subir después en el submit
        hiddenInput.dataset.file = e.target.result; // base64
        hiddenInput.dataset.fileName = file.name;
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Función para subir imagen al servidor
async function uploadImage(base64Data, fileName) {
    try {
        // Convertir base64 a blob
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('file', blob, fileName);

        const response = await fetch(`${URL}api/upload-image`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            return result.path;
        } else {
            throw new Error('Error al subir la imagen');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Configurar drop zones
setupDropZone('dropZone', 'imgFile', 'imagePreview', 'imgSrc', 'fileSelect');
setupDropZone('editDropZone', 'editImgFile', 'editImagePreview', 'editImgSrc', 'editFileSelect');

// Funciones para los botones
window.viewGuide = function (id) {
    const guide = guidesData.guides.find(g => g.id === id);
    if (guide) {
        document.getElementById('viewId').textContent = guide.id;
        document.getElementById('viewName').textContent = guide.names.es;
        document.getElementById('viewImg').src = guide.imgSrc;
        document.getElementById('viewLanguages').textContent = guide.languages.es;
        document.getElementById('viewContact').textContent = typeof guide.contact === 'string' ? guide.contact : guide.contact.es;
        document.getElementById('viewWhatsapp').href = guide.whatsapp;
        document.getElementById('viewModal').style.display = 'block';
    }
}

window.closeViewModal = function () {
    document.getElementById('viewModal').style.display = 'none';
}

window.editGuide = function (id) {
    const guide = guidesData.guides.find(g => g.id === id);
    if (guide) {
        document.getElementById('editId').value = guide.id;
        document.getElementById('editImgSrc').value = guide.imgSrc;
        document.getElementById('editName').value = guide.names.es;
        document.getElementById('editContact').value = guide.contact.replace('+593 ', '');

        // Mostrar imagen actual
        const preview = document.getElementById('editImagePreview');
        preview.src = guide.imgSrc;
        preview.style.display = 'block';

        // Limpiar checkboxes
        ['editLangEsp', 'editLangIng', 'editLangFra', 'editLangPor', 'editLangQue'].forEach(cb => {
            document.getElementById(cb).checked = false;
        });

        // Marcar los idiomas
        const langs = guide.languages.es.split(' / ');
        langs.forEach(lang => {
            if (lang === 'Español') document.getElementById('editLangEsp').checked = true;
            if (lang === 'Inglés') document.getElementById('editLangIng').checked = true;
            if (lang === 'Francés') document.getElementById('editLangFra').checked = true;
            if (lang === 'Portugués') document.getElementById('editLangPor').checked = true;
            if (lang === 'Quechua') document.getElementById('editLangQue').checked = true;
        });

        document.getElementById('editModal').style.display = 'block';
    }
}

window.closeFormModal = function () {
    document.getElementById('guideModal').style.display = 'none';
    document.getElementById('guideForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
}

window.closeEditModal = function () {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editForm').reset();
    document.getElementById('editImagePreview').style.display = 'none';
}

window.deleteGuide = function (id) {
    if (confirm('¿Seguro que quiere eliminar este guía?')) {
        fetch(`${URL}api/guides/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                loadGuides();
            } else {
                alert('Error al eliminar el guía');
            }
        });
    }
}

// Handler para el form de editar
document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value.trim();
    const contactNum = document.getElementById('editContact').value.replace(/\D/g, '');
    const imgSrcInput = document.getElementById('editImgSrc');

    // Validar nombre
    if (!name) {
        alert('Por favor ingresa el nombre del guía');
        return;
    }

    // Validar contacto
    if (!contactNum || contactNum.length < 9) {
        alert('Por favor ingresa un número de contacto válido');
        return;
    }

    // Validar imagen - puede ser la anterior o una nueva
    let imgPath = imgSrcInput.value;
    const base64Image = imgSrcInput.dataset.file;

    // Si hay una nueva imagen (base64), subirla
    if (base64Image) {
        try {
            imgPath = await uploadImage(base64Image, imgSrcInput.dataset.fileName || 'guide-image.jpg');
        } catch (error) {
            alert('Error al subir la imagen. Por favor intenta de nuevo.');
            return;
        }
    }

    if (!imgPath) {
        alert('Por favor selecciona una imagen');
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

    const updatedGuide = {
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

    try {
        const response = await fetch(`${URL}api/guides/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGuide)
        });
        if (response.ok) {
            alert('¡Guía modificado exitosamente!');
            loadGuides();
            closeEditModal();
        } else {
            alert('Error al modificar el guía');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al modificar el guía');
    }
});