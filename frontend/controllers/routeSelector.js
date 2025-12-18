// Custom Select para el selector de rutas
document.addEventListener('DOMContentLoaded', function() {
    const selectBtn = document.getElementById('routeSelector');
    const dropdown = document.getElementById('routeSelectorDropdown');
    const options = dropdown.querySelectorAll('.custom-select-option');
    let currentValue = 'sigchos-chugchilan';

    // Abrir/cerrar dropdown
    selectBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        selectBtn.classList.toggle('active');
        dropdown.classList.toggle('show');
    });

    // Seleccionar opción
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const title = this.querySelector('.option-title').textContent;
            
            // Actualizar texto del botón
            selectBtn.querySelector('.custom-select-text').textContent = title;
            
            // Actualizar valor actual
            currentValue = value;
            
            // Actualizar estado de selección visual
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Cerrar dropdown
            selectBtn.classList.remove('active');
            dropdown.classList.remove('show');
            
            // Actualizar currentRoute en map.js
            if (typeof currentRoute !== 'undefined') {
                currentRoute = value;
            }
            
            // Llamar a la función de cargar ruta en map.js
            if (typeof loadGPXRoute === 'function') {
                destinationReached = false;
                
                // Resetear el estado del trekking al cambiar ruta
                if (typeof routeStarted !== 'undefined' && routeStarted) {
                    routeStarted = false;
                    const btnStart = document.getElementById('btnStart');
                    if (btnStart) {
                        btnStart.classList.remove('active');
                        btnStart.textContent = '🚀 INICIAR';
                    }
                }
                
                // Cargar la nueva ruta
                loadGPXRoute(value);
                
                // Mostrar mensaje inicial
                if (typeof hideInitialMessage === 'function') {
                    hideInitialMessage();
                }
                if (typeof showInitialMessage === 'function') {
                    showInitialMessage();
                }
                if (typeof hideCelebrationMessage === 'function') {
                    hideCelebrationMessage();
                }
                if (typeof showBanner === 'function') {
                    showBanner('Ruta cambiada a ' + title);
                }
            }
        });
    });

    // Marcar primera opción como seleccionada
    options[0].classList.add('selected');

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!selectBtn.contains(e.target) && !dropdown.contains(e.target)) {
            selectBtn.classList.remove('active');
            dropdown.classList.remove('show');
        }
    });

    // Exposer función para obtener el valor actual
    window.getSelectedRoute = function() {
        return currentValue;
    };
});
