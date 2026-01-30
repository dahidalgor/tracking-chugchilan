// Maneja el formulario público de registro de guías y almacenamiento en localStorage
(function(){
  const openBtn = document.getElementById('beGuideBtn');
  const modal = document.getElementById('guideRegisterModal');
  const closeBtn = document.getElementById('closeRegisterModal');
  const cancelBtn = document.getElementById('cancelRegister');
  const form = document.getElementById('guideRegisterForm');
  const successModal = document.getElementById('registerSuccess');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const langOtherCb = document.getElementById('langOtherCb');
  const langOtherText = document.getElementById('langOtherText');

  function openModal() {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  function showSuccess() {
    if (successModal) {
      successModal.style.display = 'flex';
    }
  }

  function closeSuccess() {
    if (successModal) {
      successModal.style.display = 'none';
    }
  }

  function saveRequest(data) {
    try {
      const key = 'guide_requests';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving request', e);
    }
  }

  if (langOtherCb && langOtherText) {
    langOtherCb.addEventListener('change', () => {
      langOtherText.style.display = langOtherCb.checked ? 'block' : 'none';
      if (!langOtherCb.checked) langOtherText.value = '';
    });
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Recolectar campos
      const firstName = document.getElementById('regFirstName').value.trim();
      const lastName = document.getElementById('regLastName').value.trim();
      let whatsapp = document.getElementById('regWhatsapp').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const langs = Array.from(form.querySelectorAll('input[name="lang"]:checked')).map(i => i.value);
      const other = document.getElementById('langOtherText')?.value.trim();
      if (other) langs.push(other);

      const t = (k) => (window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][k]) || k;
      if (!firstName || !lastName) return alert(t('validation_first_last'));
      if (!whatsapp) return alert(t('validation_whatsapp'));
      if (!email) return alert(t('validation_email'));
      if (langs.length === 0) return alert(t('validation_lang_required'));

      // Normalizar whatsapp: asegurar prefijo +593
      whatsapp = whatsapp.replace(/\s+/g, '');
      if (!whatsapp.startsWith('+')) whatsapp = '+' + whatsapp;
      if (!whatsapp.startsWith('+593')) {
        // si el usuario usó otro prefijo, intentar agregar 593 si tenía 9 dígitos
        const digits = whatsapp.replace(/\D/g, '');
        if (digits.length === 9) whatsapp = '+593' + digits;
      }

      // Construir objeto de solicitud
      const request = {
        id: Date.now(),
        firstName,
        lastName,
        whatsapp,
        email,
        languages: langs,
        status: 'new',
        createdAt: new Date().toISOString()
      };

      // Cerrar modal antes de mostrar mensaje (requerimiento)
      closeModal();

      // Guardar
      saveRequest(request);

      // Mostrar mensaje de éxito
      showSuccess();
      // Limpiar formulario
      form.reset();

      // Mantener el success abierto hasta que usuario cierre
    });
  }

  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {
    closeSuccess();
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
    if (e.target === successModal) closeSuccess();
  });

})();
