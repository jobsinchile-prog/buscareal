/**
 * Sistema de Autenticación - Core
 * Gestiona usuarios, registro, login y sesiones
 */

class AuthService {
  static USERS_KEY = 'app_users';
  static CURRENT_USER_KEY = 'current_user';
  static DEMO_USERS_INITIALIZED = 'demo_users_initialized';

  // Obtener todos los usuarios
  static getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Guardar usuarios
  static saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Obtener usuario actual
  static getCurrentUser() {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Establecer usuario actual
  static setCurrentUser(user) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Limpiar usuario actual
  static clearCurrentUser() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Verificar si bcrypt está disponible
  static isBcryptAvailable() {
    return typeof bcrypt !== 'undefined' && typeof bcrypt.hash === 'function';
  }

  // Registrar nuevo usuario
  static async register(userData) {
    const users = this.getUsers();
    
    // Verificar email único
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Verificar que bcrypt esté disponible
    if (!this.isBcryptAvailable()) {
      throw new Error('Error: bcrypt no está disponible. Recarga la página.');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
      phone: userData.phone?.trim() || '',
      userType: userData.userType,
      businessName: userData.businessName?.trim() || '',
      taxId: userData.taxId?.trim() || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  // Login de usuario
  static async login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar que bcrypt esté disponible
    if (!this.isBcryptAvailable()) {
      throw new Error('Error: bcrypt no está disponible. Recarga la página.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      throw new Error('Credenciales incorrectas');
    }

    // Crear copia sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    
    return userWithoutPassword;
  }

  // Logout
  static logout() {
    this.clearCurrentUser();
  }

  // Verificar si hay sesión activa
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Verificar si los usuarios de prueba ya fueron inicializados
  static areDemoUsersInitialized() {
    return localStorage.getItem(this.DEMO_USERS_INITIALIZED) === 'true';
  }

  // Inicializar usuarios de prueba
  static async initializeDemoUsers() {
    // Solo inicializar una vez
    if (this.areDemoUsersInitialized()) {
      return;
    }

    // Verificar que bcrypt esté disponible
    if (!this.isBcryptAvailable()) {
      console.warn('⚠️ bcrypt no disponible aún, reintentando...');
      setTimeout(() => this.initializeDemoUsers(), 100);
      return;
    }

    try {
      // Generar hash REAL de "comprador123"
      const hashedPassword = await bcrypt.hash('comprador123', 10);
      
      // Crear usuarios de prueba
      const demoUsers = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'comprador@test.com',
          password: hashedPassword,
          phone: '555-1234',
          userType: 'buyer',
          businessName: '',
          taxId: '',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'María García',
          email: 'vendedor@test.com',
          password: hashedPassword,
          phone: '555-5678',
          userType: 'seller',
          businessName: 'Tienda María',
          taxId: '123456789',
          createdAt: new Date().toISOString()
        }
      ];

      // Guardar usuarios
      this.saveUsers(demoUsers);
      
      // Marcar como inicializado
      localStorage.setItem(this.DEMO_USERS_INITIALIZED, 'true');
      
      console.log('%c✅✅✅ USUARIOS DE PRUEBA INICIALIZADOS ✅✅✅', 'color: green; font-weight: bold;');
      console.log('%c   - Comprador: comprador@test.com / comprador123', 'color: blue;');
      console.log('%c   - Vendedor: vendedor@test.com / comprador123', 'color: blue;');
    } catch (error) {
      console.error('❌ Error al inicializar usuarios de prueba:', error);
    }
  }
}

// Inicializar usuarios de prueba cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un momento para asegurar que bcrypt esté cargado
  setTimeout(() => {
    if (AuthService.isBcryptAvailable()) {
      console.log('%c✅ bcrypt.js disponible - Inicializando usuarios de prueba...', 'color: green;');
      AuthService.initializeDemoUsers();
    } else {
      console.error('%c❌ bcrypt.js NO está disponible. Verifica el orden de los scripts.', 'color: red;');
    }
  }, 100);
});
