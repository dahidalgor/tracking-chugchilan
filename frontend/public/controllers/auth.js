/**
 * Controlador de autenticación de usuarios
 * Lee los datos del archivo users.json
 */

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

class AuthController {
  constructor() {
    this.users = [];
  }

  /**
   * Carga los usuarios desde el archivo JSON
   */
  async loadUsers() {
    try {
      const url = BASE_PATH + 'data/users.json';
      console.log('Cargando usuarios desde:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      this.users = await response.json();
      console.log('Usuarios cargados:', this.users.length);
      return true;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      return false;
    }
  }

  /**
   * Valida las credenciales del usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {object|null} Objeto del usuario si es válido, null si no
   */
  validateCredentials(username, password) {
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return null;
    }
    
    if (user.password === password) {
      // Retornar usuario sin la contraseña
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  /**
   * Inicia sesión y guarda el token en localStorage
   * @param {object} user - Objeto del usuario
   */
  login(user) {
    const token = {
      id: user.id,
      username: user.username,
      email: user.email,
      timestamp: Date.now()
    };
    
    localStorage.setItem('authToken', JSON.stringify(token));
    localStorage.setItem('isLoggedIn', 'true');
  }

  /**
   * Obtiene el usuario actual de la sesión
   * @returns {object|null} Objeto del usuario si existe sesión, null si no
   */
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        return JSON.parse(token);
      } catch (error) {
        console.error('Error al parsear token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica si hay una sesión activa
   * @returns {boolean} true si hay sesión activa, false si no
   */
  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
  }

  /**
   * Protege una página requiriendo login
   * Si no hay sesión activa, redirige a login.html
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  }
}

// Exportar la instancia del controlador
const authController = new AuthController();
export default authController;
