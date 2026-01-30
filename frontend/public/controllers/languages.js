// Configuración de traducciones
const translations = {
  es: {
    // Navbar
    inicio: "INICIO",
    ruta: "RUTA",
    hospedaje: "HOSPEDAJE",
    actividades: "ACTIVIDADES",
    guias: "GUÍAS",
    contacto: "CONTACTO",
    planificar: "¿Administrador?",

    // Hero
    title: "TRACKING QUILOTOA",
    subtitle: "Caminar es solo el comienzo: vive la experiencia andina, comparte con su gente y guarda momentos que quedarán para siempre.",
    explorar: "Explorar",

    // Secciones
    laRuta: "LA RUTA",
    rutaSub: "Explora el recorrido completo y planifica tus paradas favoritas.",
    hospedajeTitle: "HOSPEDAJE",
    hospedajeSub: "Elige tu mejor opción para hospedarte y relajarte",
    actividadesTitle: "ACTIVIDADES",
    actividadesSub: "Programas auténticos en granjas y paisajes andinos, operados por la comunidad.",
    guiasTitle: "Guías locales certificados",
    guiasSub: "Conocimiento de territorio, seguridad y acompañamiento en tu idioma.",
    contactoTitle: "¿Listo para empezar?",
    contactoSub: "Escríbenos fechas, número de personas y actividades que te interesan.",

    // Botones
    iniciar: "🚀 INICIAR",
    seguir: "🧭 Seguir OFF",
    ubicacion: "📍 Mi ubicación",
    brujula: "🧲 Brújula",
    contactar: "Contactar",
    beGuideBtn: "¿Quieres ser guía?",

    // Formulario de registro público
    guideRegisterTitle: "Registro de Guía",
    guideRegisterSubtitle: "Ingresa tus datos y un administrador se pondrá en contacto.",
    regFirstNameLabel: "Nombres",
    regLastNameLabel: "Apellidos",
    regWhatsappLabel: "Número de WhatsApp",
    regEmailLabel: "Correo",
    languagesLegend: "Idiomas",
    langOtherLabel: "Otro",
    regCancel: "Cancelar",
    regSubmit: "Enviar",
    registerSuccessTitle: "¡Gracias!",
    registerSuccessMessage: "Hemos recibido tu solicitud. Un administrador se pondrá en contacto pronto.",
    registerSuccessClose: "Cerrar",
    // Confirmaciones y validaciones
    confirmDeleteRequest: "¿Seguro que desea eliminar esta solicitud?",
    confirmDeleteGuide: "¿Seguro que quiere eliminar este guía? Esta acción no se puede deshacer.",
    alertRequestDeleted: "Solicitud eliminada",
    alertGuideDeleted: "Guía eliminado exitosamente (localmente)",
    validation_first_last: "Por favor completa tus nombres y apellidos",
    validation_whatsapp: "Por favor ingresa número de WhatsApp",
    validation_email: "Por favor ingresa un correo válido",
    validation_lang_required: "Selecciona al menos un idioma",

    // Leyenda
    leyenda: "Ruta Quilotoa Trail",

    // Banner
    banner: "Te alejaste de la ruta (&gt;30 m)",

    // Rutas y mensajes
    routeSelectorLabel: "Selecciona tu ruta:",
    routeOption1: "Sigchos - Chugchilan",
    routeOption2: "Chugchilan - Quilotoa",
    initialMessage: "¿Preparado? ¡Empecemos!",
    celebrationChugchilan: "¡Felicitaciones! Llegaste a Chugchilan",
    celebrationQuilotoa: "¡Felicitaciones! Llegaste a Quilotoa",

        // FOOTER
    footerText: "Impulsando comunidades mediante herramientas digitales y turismo responsable. Proyecto de vinculación PUCE.",
    ayudaTitle: "Ayuda",
    soporte: "Soporte",
    privacidad: "Privacidad",
    proyectoTitle: "Proyecto",
    creditos: "Créditos",
    copyright: "© 2026 TRACKING CHUGCHILÁN. Todos los derechos reservados."

  },
  en: {
    // Navbar
    inicio: "HOME",
    ruta: "ROUTE",
    hospedaje: "ACCOMMODATION",
    actividades: "ACTIVITIES",
    guias: "GUIDES",
    contacto: "CONTACT",
    planificar: "Administrator?",

    // Hero
    title: "TRACKING QUILOTOA",
    subtitle: "Walking is just the beginning: live the Andean experience, share with its people and keep moments that will last forever.",
    explorar: "Explore",

    // Secciones
    laRuta: "THE ROUTE",
    rutaSub: "Explore the complete route and plan your favorite stops.",
    hospedajeTitle: "ACCOMMODATION",
    hospedajeSub: "Choose your best option to stay and relax",
    actividadesTitle: "ACTIVITIES",
    actividadesSub: "Authentic programs in farms and Andean landscapes, operated by the community.",
    guiasTitle: "Certified local guides",
    guiasSub: "Territory knowledge, safety and support in your language.",
    contactoTitle: "Ready to start?",
    contactoSub: "Write us dates, number of people and activities that interest you.",

    // Botones
    iniciar: "🚀 START",
    seguir: "🧭 Follow OFF",
    ubicacion: "📍 My location",
    brujula: "🧲 Compass",
    contactar: "Contact",
    beGuideBtn: "Want to be a guide?",

    // Public registration form
    guideRegisterTitle: "Guide Registration",
    guideRegisterSubtitle: "Enter your details and an administrator will contact you.",
    regFirstNameLabel: "First name",
    regLastNameLabel: "Last name",
    regWhatsappLabel: "WhatsApp number",
    regEmailLabel: "Email",
    languagesLegend: "Languages",
    langOtherLabel: "Other",
    regCancel: "Cancel",
    regSubmit: "Submit",
    registerSuccessTitle: "Thank you!",
    registerSuccessMessage: "We have received your request. An administrator will contact you soon.",
    registerSuccessClose: "Close",
    // Confirmations and validations
    confirmDeleteRequest: "Are you sure you want to delete this request?",
    confirmDeleteGuide: "Are you sure you want to delete this guide? This action cannot be undone.",
    alertRequestDeleted: "Request deleted",
    alertGuideDeleted: "Guide deleted successfully (locally)",
    validation_first_last: "Please complete your first and last name",
    validation_whatsapp: "Please enter a WhatsApp number",
    validation_email: "Please enter a valid email",
    validation_lang_required: "Select at least one language",

    // Leyenda
    leyenda: "Quilotoa Trail Route",

    // Banner
    banner: "You moved away from the route (&gt;30 m)",

    // Routes and messages
    routeSelectorLabel: "Select your route:",
    routeOption1: "Sigchos - Chugchilan",
    routeOption2: "Chugchilan - Quilotoa",
    initialMessage: "Ready? Let's go!",
    celebrationChugchilan: "Congratulations! You arrived at Chugchilan",
    celebrationQuilotoa: "Congratulations! You arrived at Quilotoa",

        // FOOTER
    footerText: "Empowering communities through digital tools and responsible tourism. PUCE outreach project.",
    ayudaTitle: "Help",
    soporte: "Support",
    privacidad: "Privacy",
    proyectoTitle: "Project",
    creditos: "Credits",
    copyright: "© 2026 TRACKING CHUGCHILÁN. All rights reserved."

  },
  fr: {
    // Navbar
    inicio: "ACCUEIL",
    ruta: "ROUTE",
    hospedaje: "HÉBERGEMENT",
    actividades: "ACTIVITÉS",
    guias: "GUIDES",
    contacto: "CONTACT",
    planificar: "Administrateur ?",

    // Hero
    title: "TRACKING QUILOTOA",
    subtitle: "Marcher n'est que le début : vivez l'expérience andine, partagez avec ses habitants et gardez des moments qui dureront toujours.",
    explorar: "Explorer",

    // Secciones
    laRuta: "LA ROUTE",
    rutaSub: "Explorez le parcours complet et planifiez vos arrêts préférés.",
    hospedajeTitle: "HÉBERGEMENT",
    hospedajeSub: "Choisissez votre meilleure option pour séjourner et vous détendre",
    actividadesTitle: "ACTIVITÉS",
    actividadesSub: "Programmes authentiques dans des fermes et paysages andins, gérés par la communauté.",
    guiasTitle: "Guides locaux certifiés",
    guiasSub: "Connaissance du territoire, seguridad y acompañamiento dans votre langue.",
    contactoTitle: "Prêt à commencer?",
    contactoSub: "Écrivez-nous les dates, le nombre de personnes et les actividades qui vous intéressent.",

    // Botones
    iniciar: "🚀 DÉMARRER",
    seguir: "🧭 Suivre OFF",
    ubicacion: "📍 Ma position",
    brujula: "🧲 Boussole",
    contactar: "Contacter",
      beGuideBtn: "Voulez-vous être guide?",

      // Formulaire public
      guideRegisterTitle: "Inscription Guide",
      guideRegisterSubtitle: "Entrez vos informations et un administrateur vous contactera.",
      regFirstNameLabel: "Prénom",
      regLastNameLabel: "Nom",
      regWhatsappLabel: "Numéro WhatsApp",
      regEmailLabel: "Email",
      languagesLegend: "Langues",
      langOtherLabel: "Autre",
      regCancel: "Annuler",
      regSubmit: "Envoyer",
      registerSuccessTitle: "Merci!",
      registerSuccessMessage: "Nous avons reçu votre demande. Un administrateur vous contactera bientôt.",
      registerSuccessClose: "Fermer",
      // Confirmations and validations
      confirmDeleteRequest: "Êtes-vous sûr de vouloir supprimer cette demande ?",
      confirmDeleteGuide: "Êtes-vous sûr de vouloir supprimer ce guide ? Cette action est irréversible.",
      alertRequestDeleted: "Demande supprimée",
      alertGuideDeleted: "Guide supprimé avec succès (localement)",
      validation_first_last: "Veuillez compléter votre nom et prénom",
      validation_whatsapp: "Veuillez entrer un numéro WhatsApp",
      validation_email: "Veuillez entrer un e-mail valide",
      validation_lang_required: "Sélectionnez au moins une langue",

    // Leyenda
    leyenda: "Route Quilotoa Trail",

    // Banner
    banner: "Vous vous êtes éloigné de la route (&gt;30 m)",

    // Routes et messages
    routeSelectorLabel: "Sélectionnez votre route:",
    routeOption1: "Sigchos - Chugchilan",
    routeOption2: "Chugchilan - Quilotoa",
    initialMessage: "Prêt? Commençons!",
    celebrationChugchilan: "Félicitations! Vous êtes arrivé à Chugchilan",
    celebrationQuilotoa: "Félicitations! Vous êtes arrivé à Quilotoa",

        // FOOTER
    footerText: "Autonomiser les communautés grâce à des outils numériques et un tourisme responsable. Projet de liaison PUCE.",
    ayudaTitle: "Aide",
    soporte: "Support",
    privacidad: "Confidentialité",
    proyectoTitle: "Projet",
    creditos: "Crédits",
    copyright: "© 2026 TRACKING CHUGCHILÁN. Tous droits réservés."

  },
  pt: {
    // Navbar
    inicio: "INÍCIO",
    ruta: "ROTA",
    hospedaje: "HOSPEDAGEM",
    actividades: "ATIVIDADES",
    guias: "GUIAS",
    contacto: "CONTATO",
    planificar: "Administrador?",

    // Hero
    title: "TRACKING QUILOTOA",
    subtitle: "Caminhar é apenas o começo: viva a experiência andina, compartilhe com seu povo e guarde momentos que durarão para sempre.",
    explorar: "Explorar",

    // Secciones
    laRuta: "A ROTA",
    rutaSub: "Explore a rota completa e planeje suas paradas favoritas.",
    hospedajeTitle: "HOSPEDAGEM",
    hospedajeSub: "Escolha sua melhor opción para hospedar-se e relaxar",
    actividadesTitle: "ATIVIDADES",
    actividadesSub: "Programas autênticos em fazendas e paisagens andinas, operados pela comunidade.",
    guiasTitle: "Guias locais certificados",
    guiasSub: "Conhecimento do território, segurança e acompanhamento em seu idioma.",
    contactoTitle: "Pronto para começar?",
    contactoSub: "Escreva-nos datas, número de pessoas e actividades que lhe interessam.",

    // Botones
    iniciar: "🚀 INICIAR",
    seguir: "🧭 Seguir OFF",
    ubicacion: "📍 Minha localización",
    brujula: "🧲 Bússola",
    contactar: "Contactar",
    beGuideBtn: "Quer ser guia?",

    // Formulário público
    guideRegisterTitle: "Registro de Guia",
    guideRegisterSubtitle: "Insira seus dados e um administrador entrará em contato.",
    regFirstNameLabel: "Nombres",
    regLastNameLabel: "Apellidos",
    regWhatsappLabel: "Número de WhatsApp",
    regEmailLabel: "Correo",
    languagesLegend: "Idiomas",
    langOtherLabel: "Outro",
    regCancel: "Cancelar",
    regSubmit: "Enviar",
    registerSuccessTitle: "Obrigado!",
    registerSuccessMessage: "Recebemos sua solicitação. Um administrador entrará em contato em breve.",
    registerSuccessClose: "Fechar",
    // Confirmations and validations
    confirmDeleteRequest: "Tem certeza de que deseja excluir esta solicitação?",
    confirmDeleteGuide: "Tem certeza de que deseja excluir este guia? Esta ação não pode ser desfeita.",
    alertRequestDeleted: "Solicitação excluída",
    alertGuideDeleted: "Guia excluído com sucesso (localmente)",
    validation_first_last: "Por favor complete nomes e sobrenomes",
    validation_whatsapp: "Por favor insira um número de WhatsApp",
    validation_email: "Por favor insira um e-mail válido",
    validation_lang_required: "Selecione pelo menos um idioma",

    // Leyenda
    leyenda: "Rota Quilotoa Trail",

    // Banner
    banner: "Você se afastou da rota (&gt;30 m)",

    // Rotas e mensagens
    routeSelectorLabel: "Selecione sua rota:",
    routeOption1: "Sigchos - Chugchilan",
    routeOption2: "Chugchilan - Quilotoa",
    initialMessage: "Pronto? Vamos começar!",
    celebrationChugchilan: "Parabéns! Você chegou em Chugchilan",
    celebrationQuilotoa: "Parabéns! Você chegou em Quilotoa",

      // FOOTER
    footerText: "Capacitando comunidades por meio de ferramentas digitais e turismo responsável. Projeto de extensão PUCE.",
    ayudaTitle: "Ajuda",
    soporte: "Suporte",
    privacidad: "Privacidade",
    proyectoTitle: "Projeto",
    creditos: "Créditos",
    copyright: "© 2026 TRACKING CHUGCHILÁN. Todos os direitos reservados."

  },
  qu: {
    // Navbar
    inicio: "KALLARI",
    ruta: "ÑAN",
    hospedaje: "PUYU",
    actividades: "RUNAYAY",
    guias: "YACHAQ",
    contacto: "RIMAY",
    planificar: "¿Kamachiq?",

    // Hero
    title: "QUILOTOA KATIKUY",
    subtitle: "Puriy aslla kallarimanta kashan: Andes yachayta kawsay, runakunawan tinkuy, wiñaypak kawsayta waqaychay.",
    explorar: "Taripay",

    // Secciones
    laRuta: "ÑAN",
    rutaSub: "Hunt'a ñanta taripay, munay sayaykunatapas kamachiy.",
    hospedajeTitle: "PUYU",
    hospedajeSub: "Alli akllayta akllay, samaytapas puñunaykipaq",
    actividadesTitle: "RUNAYAY",
    actividadesSub: "Cheqaq ruraykuna, llaktakunap llamkayninpi, allpapi, Andes pachapi.",
    guiasTitle: "Yachayniyuq yachaqkuna",
    guiasSub: "Allpa yachay, hawka, rimaykipi yanapay.",
    contactoTitle: "Kallarichun listu kashanki?",
    contactoSub: "Qillqay p'unchaykuna, runakuna, munay ruraykunata.",

    // Botones
    iniciar: "🚀 KALLARI",
    seguir: "🧭 Katikuy OFF",
    ubicacion: "📍 Kaypi kani",
    brujula: "🧲 Suyu rikuchina",
    contactar: "Rimay",
    beGuideBtn: "¿Yachachiymi qam?",

    // Formulario
    guideRegisterTitle: "Yachaq nisqa ruwasqa",
    guideRegisterSubtitle: "Qillqiy qankuna, huk kamachiq rimanqa.",
    regFirstNameLabel: "Sutiykuna",
    regLastNameLabel: "Aylluchaykuna",
    regWhatsappLabel: "WhatsApp numera",
    regEmailLabel: "Correo",
    languagesLegend: "Rimaykuna",
    langOtherLabel: "Otra",
    regCancel: "Chinkay",
    regSubmit: "Tukuy",
    registerSuccessTitle: "Sulpayki!",
    registerSuccessMessage: "Qillqaykita rikuchisqayku. Huk kamachiq rimanqa pasaykuchkan.",
    registerSuccessClose: "Chinkay",
    // Confirmations and validations
    confirmDeleteRequest: "Imayna, rikhuymi chay willakuykita chinkachiy?",
    confirmDeleteGuide: "Imayna, rikhuymi chay yachaqta chinkachiy? Hinalla mana chinkachakuchu.",
    alertRequestDeleted: "Willakuy chinkachisqa",
    alertGuideDeleted: "Yachaq chinkachisqa (local)",
    validation_first_last: "Qillqiy sutiykuna chaylla kaypi",
    validation_whatsapp: "Qillqiy WhatsApp numera",
    validation_email: "Qillqiy correo ruwasqa",
    validation_lang_required: "Sapa rimaykuna hinaqta rikhuy",

    // Leyenda
    leyenda: "Quilotoa Ñan",

    // Banner
    banner: "Ñanmanta karu rikuranki (&gt;30 m)",

    // Ñankuna, willaykuna
    routeSelectorLabel: "Akllay ñanta:",
    routeOption1: "Sigchos - Chugchilan",
    routeOption2: "Chugchilan - Quilotoa",
    initialMessage: "¿Allinchu? ¡Kallarichu!",
    celebrationChugchilan: "¡Sulpayki! Chugchilanman rikurankichu",
    celebrationQuilotoa: "¡Sulpayki! Quilotaoman rikurankichu",

        // FOOTER
    footerText: "Llaktakunata kallpanchay, ch'ipiy yanapakuy, allin turismowan. PUCE tinkuy ruray.",
    ayudaTitle: "Yanapay",
    soporte: "Yanapay",
    privacidad: "Pakasqa willay",
    proyectoTitle: "Ruray",
    creditos: "Yupaychana",
    copyright: "© 2026 TRACKING CHUGCHILÁN. Llapallan hayñikuna waqaychasqa."

  }
};

// Función para cambiar el idioma
function changeLanguage(lang) {
  // Guardar preferencia
  localStorage.setItem('preferredLanguage', lang);

  // Actualizar atributo lang del HTML
  document.documentElement.lang = lang;

  // Actualizar variable global de idioma actual
  currentLanguage = lang;

  // Obtener traducciones
  const t = translations[lang];

  // Actualizar navbar
  document.querySelectorAll('#menu a').forEach((link, index) => {
    const keys = ['inicio', 'ruta', 'hospedaje', 'actividades', 'guias', 'contacto'];
    if (keys[index]) link.textContent = t[keys[index]];
  });

  // Actualizar botón de planificar
  document.querySelector('.cta').textContent = t.planificar;

  // Actualizar hero
  document.querySelector('#hero h1').textContent = t.title;
  document.querySelector('#hero p').textContent = t.subtitle;
  document.querySelector('#hero .btn-primary').textContent = t.explorar;

  // Actualizar sección ruta
  document.querySelector('#ruta .title').textContent = t.laRuta;
  document.querySelector('#ruta .subtitle').textContent = t.rutaSub;
  document.querySelector('.legend').innerHTML = '<span class="sw"></span>' + t.leyenda;
  
  const banner = document.getElementById('banner');
  if (banner) banner.textContent = t.banner;

  // Actualizar botones del mapa
  const btnStart = document.getElementById('btnStart');
  if (btnStart) btnStart.textContent = t.iniciar;
  
  const btnFollow = document.getElementById('btnFollow');
  if (btnFollow) {
    btnFollow.title = t.seguir;
    btnFollow.setAttribute('aria-label', t.seguir);
  }
  
  const btnLocate = document.getElementById('btnLocate');
  if (btnLocate) {
    btnLocate.title = t.ubicacion;
    btnLocate.setAttribute('aria-label', t.ubicacion);
  }
  
  const btnCompass = document.getElementById('btnCompass');
  if (btnCompass) btnCompass.textContent = t.brujula;

  // Actualizar hospedaje
  document.querySelector('#hospedaje .title').textContent = t.hospedajeTitle;
  document.querySelector('#hospedaje .subtitle').textContent = t.hospedajeSub;

  // Actualizar actividades
  document.querySelector('#actividades .title').textContent = t.actividadesTitle;
  document.querySelector('#actividades .subtitle').textContent = t.actividadesSub;

  // Actualizar guías
  document.querySelector('#guias .title').textContent = t.guiasTitle;
  document.querySelector('#guias .subtitle').textContent = t.guiasSub;

  // Actualizar contacto
  document.querySelector('#contacto .title').textContent = t.contactoTitle;
  document.querySelector('#contacto .subtitle').textContent = t.contactoSub;
  document.querySelector('#contacto .btn-primary').textContent = t.contactar;

  // Actualizar selector de rutas y etiqueta
  const routeSelectorLabel = document.getElementById('routeSelectorLabel');
  if (routeSelectorLabel) routeSelectorLabel.textContent = t.routeSelectorLabel;

  // Actualizar opciones del select
  const routeOptions = document.querySelectorAll('.route-selector option');
  if (routeOptions[0]) routeOptions[0].textContent = t.routeOption1;
  if (routeOptions[1]) routeOptions[1].textContent = t.routeOption2;

  // Actualizar mensaje inicial
  const initialMessageText = document.getElementById('initialMessageText');
  if (initialMessageText) initialMessageText.textContent = t.initialMessage;

  // Actualizar etiqueta del botón de idioma
  const langNames = { es: 'Spanish', en: 'English', fr: 'French', pt: 'Portuguese', qu: 'Quechua' };
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) languageToggle.textContent = '🌐 ' + langNames[lang];

  // Actualizar información de los guías en el modal si está abierto
  if (typeof updateModalForLanguage === 'function') {
    updateModalForLanguage(lang);
  }
  // ACTUALIZAR FOOTER - AÑADE ESTA SECCIÓN
  // Actualizar texto del footer
  const footerText = document.querySelector('.footer-text');
  if (footerText) footerText.textContent = t.footerText;

  // Actualizar títulos del footer
  const ayudaTitle = document.querySelector('.footer-title:nth-of-type(1)');
  if (ayudaTitle) ayudaTitle.textContent = t.ayudaTitle;

  const proyectoTitle = document.querySelector('.footer-title:nth-of-type(2)');
  if (proyectoTitle) proyectoTitle.textContent = t.proyectoTitle;

  // Actualizar enlaces del footer
  const soporteLink = document.querySelector('.footer-links a[href*="mailto:soporte"]');
  if (soporteLink) {
    const span = soporteLink.querySelector('span');
    if (span) {
      soporteLink.innerHTML = soporteLink.innerHTML.replace(/Soporte/, t.soporte);
    } else {
      soporteLink.textContent = t.soporte;
    }
  }

  const privacidadLink = document.querySelector('.footer-links a[href*="politicas-privacidad"]');
  if (privacidadLink) {
    const span = privacidadLink.querySelector('span');
    if (span) {
      privacidadLink.innerHTML = privacidadLink.innerHTML.replace(/Privacidad/, t.privacidad);
    } else {
      privacidadLink.textContent = t.privacidad;
    }
  }

  const creditosLink = document.querySelector('.footer-links a[href*="creditos"]');
  if (creditosLink) {
    const span = creditosLink.querySelector('span');
    if (span) {
      creditosLink.innerHTML = creditosLink.innerHTML.replace(/Créditos/, t.creditos);
    } else {
      creditosLink.textContent = t.creditos;
    }
  }

  // Actualizar copyright
  const copyright = document.querySelector('.copyright');
  if (copyright) copyright.textContent = t.copyright;

  // Recargar puntos de interés con el nuevo idioma
  loadInterestPoints(lang);

  // Actualizar texto del botón '¿Quieres ser guía?'
  const beGuideBtn = document.getElementById('beGuideBtn');
  if (beGuideBtn) beGuideBtn.textContent = t.beGuideBtn;

  // Modal de registro público de guías
  const guideModalTitle = document.querySelector('#guideRegisterModal .modal-header h2');
  const guideModalSubtitle = document.querySelector('#guideRegisterModal .modal-header p');
  if (guideModalTitle) guideModalTitle.textContent = t.guideRegisterTitle;
  if (guideModalSubtitle) guideModalSubtitle.textContent = t.guideRegisterSubtitle;

  // Form labels
  const lblFirst = document.querySelector('label[for="regFirstName"]');
  const lblLast = document.querySelector('label[for="regLastName"]');
  const lblWhatsapp = document.querySelector('label[for="regWhatsapp"]');
  const lblEmail = document.querySelector('label[for="regEmail"]');
  const legend = document.querySelector('#guideRegisterForm legend');
  const langOtherCbLabel = document.querySelector('label[for="langOtherCb"]');
  const langOtherText = document.getElementById('langOtherText');
  if (lblFirst) lblFirst.textContent = t.regFirstNameLabel;
  if (lblLast) lblLast.textContent = t.regLastNameLabel;
  if (lblWhatsapp) lblWhatsapp.textContent = t.regWhatsappLabel;
  if (lblEmail) lblEmail.textContent = t.regEmailLabel;
  if (legend) legend.textContent = t.languagesLegend;
  // The checkbox label for 'Otro' doesn't have for attr; find input and nextSibling text
  const otherLabel = Array.from(document.querySelectorAll('#guideRegisterForm label')).find(l => l.textContent.trim().includes('Otro') || l.textContent.trim().includes('Other') || l.textContent.trim().includes('Otra'));
  if (otherLabel) otherLabel.childNodes[1].nodeValue = ' ' + t.langOtherLabel;
  if (langOtherText) langOtherText.placeholder = t.langOtherLabel;

  // Buttons: cancel and submit in form
  const cancelRegister = document.getElementById('cancelRegister');
  if (cancelRegister) cancelRegister.textContent = t.regCancel;
  const submitBtn = document.querySelector('#guideRegisterForm button[type="submit"]');
  if (submitBtn) submitBtn.textContent = t.regSubmit;

  // Success modal text
  const successTitle = document.querySelector('#registerSuccess h3');
  const successMsg = document.querySelector('#registerSuccess p');
  const successClose = document.getElementById('closeSuccessBtn');
  if (successTitle) successTitle.textContent = t.registerSuccessTitle;
  if (successMsg) successMsg.textContent = t.registerSuccessMessage;
  if (successClose) successClose.textContent = t.registerSuccessClose;

  // Actualizar mensaje de celebración si existe
  updateCelebrationMessageText(lang);

  // Actualizar datos de actividades y hospedajes con nuevo idioma
  updateDataForLanguage(lang);

  // Cerrar menú de idiomas
  closeLanguageMenu();
}

// Funciones para manejar el menú de idiomas
const languageToggle = document.getElementById('languageToggle');
const languageMenu = document.getElementById('languageMenu');
const langOptions = document.querySelectorAll('.lang-option');

function toggleLanguageMenu() {
  const isExpanded = languageToggle.getAttribute('aria-expanded') === 'true';
  languageToggle.setAttribute('aria-expanded', !isExpanded);
  languageMenu.classList.toggle('active');
}

function closeLanguageMenu() {
  languageToggle.setAttribute('aria-expanded', 'false');
  languageMenu.classList.remove('active');
}
// Función para actualizar datos con nuevo idioma
function updateDataForLanguage(lang) {
    // Actualizar el dataLoader si está disponible
    if (window.dataLoader && window.dataLoader.setCurrentLanguage) {
        window.dataLoader.setCurrentLanguage(lang);
    } else {
        console.warn('dataLoader no disponible');
        // Forzar recarga de datos
        setTimeout(() => {
            if (window.dataLoader && window.dataLoader.loadActivities) {
                window.dataLoader.loadActivities();
                window.dataLoader.loadLodgings();
            }
        }, 100);
    }
}

// Event listeners para cambio de idioma
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        changeLanguage(lang);
    });
});

// Event listeners para el menú de idiomas
languageToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleLanguageMenu();
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!languageToggle.contains(e.target) && !languageMenu.contains(e.target)) {
    closeLanguageMenu();
  }
});

// Cerrar menú al hacer scroll
window.addEventListener('scroll', closeLanguageMenu);

// Cargar idioma guardado al inicio
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'es';
  currentLanguage = savedLang;
  changeLanguage(savedLang);
});