const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

// Cerrar menu al hacer click en un enlace
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });
});

// Cerrar menu al hacer scroll
window.addEventListener('scroll', () => {
  hamburger.classList.remove('active');
  menu.classList.remove('active');
});