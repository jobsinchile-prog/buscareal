/**
 * Sistema de Autenticación - Core
 * Gestiona usuarios, registro, login y sesiones
 */

class AuthService {
  static USERS_KEY = 'app_users';
  static CURRENT_USER_KEY = 'current_user';

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
      throw new Error('Credenciales incorrectas');
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

  // Inicializar usuarios de prueba
  static initializeDemoUsers() {
    if (this.getUsers().length === 0) {
      bcrypt.hash('comprador123', 10).then(hash => {
        this.saveUsers([
          {
            id: '1',
            name: 'Juan Pérez',
            email: 'comprador@test.com',
            password: hash,
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
            password: hash,
            phone: '555-5678',
            userType: 'seller',
            businessName: 'Tienda María',
            taxId: '123456789',
            createdAt: new Date().toISOString()
          }
        ]);
        console.log('✅ Usuarios de prueba creados:');
        console.log('   - Comprador: comprador@test.com / comprador123');
        console.log('   - Vendedor: vendedor@test.com / comprador123');
      });
    }
  }
}

// Inicializar usuarios de prueba al cargar
document.addEventListener('DOMContentLoaded', () => {
  AuthService.initializeDemoUsers();
});
