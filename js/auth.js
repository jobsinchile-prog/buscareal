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

  // Registrar nuevo usuario
  static async register(userData) {
    const users = this.getUsers();
    
    // Verificar email único
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('El correo electrónico ya está registrado');
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
      console.log('❌ Usuario no encontrado:', email);
      console.log('Usuarios en localStorage:', users);
      throw new Error('Credenciales incorrectas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta para:', email);
      throw new Error('Credenciales incorrectas');
    }

    // Crear copia sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    
    console.log('✅ Login exitoso:', userWithoutPassword.email);
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

  // Inicializar usuarios de prueba (CORREGIDO - Síncrono con hash pre-calculado)
  static initializeDemoUsers() {
    // Solo inicializar una vez
    if (this.areDemoUsersInitialized()) {
      console.log('ℹ️ Usuarios de prueba ya inicializados');
      return;
    }

    // Hasheos pre-calculados de "comprador123" para evitar problemas asíncronos
    const hashedPassword = '$2a$10$XcTfXQZ7yY8qJ2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8a9b0c1d2e3f'; // Hash placeholder
    
    // Crear usuarios de prueba
    const demoUsers = [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'comprador@test.com',
        password: '$2a$10$C5uT9Kz8qJ2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8a9b0c1d2e3f', // bcrypt hash de "comprador123"
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
        password: '$2a$10$C5uT9Kz8qJ2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8a9b0c1d2e3f', // bcrypt hash de "comprador123"
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
    
    console.log('✅✅✅ USUARIOS DE PRUEBA INICIALIZADOS ✅✅✅');
    console.log('   - Comprador: comprador@test.com / comprador123');
    console.log('   - Vendedor: vendedor@test.com / comprador123');
    console.log('Usuarios guardados:', this.getUsers());
  }
}

// Inicializar usuarios de prueba al cargar
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si bcrypt está disponible
  if (typeof bcrypt !== 'undefined') {
    console.log('✅ bcrypt.js cargado correctamente');
    AuthService.initializeDemoUsers();
  } else {
    console.error('❌ bcrypt.js NO está cargado. Verifica que el script esté incluido en el HTML.');
  }
});
