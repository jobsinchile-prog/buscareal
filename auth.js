// ===================================
// MÓDULO DE AUTENTICACIÓN
// ===================================

/**
 * Clase para gestionar la autenticación de usuarios
 */
class AuthManager {
    constructor() {
        this.USERS_KEY = 'marketplace_users';
        this.CURRENT_USER_KEY = 'marketplace_current_user';
        this.initializeDemoUsers();
    }

    /**
     * Inicializa usuarios de prueba en localStorage
     */
    initializeDemoUsers() {
        const existingUsers = this.getAllUsers();
        
        if (existingUsers.length === 0) {
            const demoUsers = [
                {
                    id: this.generateId(),
                    nombre: 'María González',
                    email: 'comprador1@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 8765 4321',
                    userType: 'comprador',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    nombre: 'Carlos Ramírez',
                    email: 'comprador2@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 7654 3210',
                    userType: 'comprador',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    nombre: 'Ana Martínez',
                    email: 'comprador3@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 6543 2109',
                    userType: 'comprador',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    nombre: 'Roberto Silva',
                    email: 'vendedor1@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 5432 1098',
                    userType: 'vendedor',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    nombre: 'Patricia López',
                    email: 'vendedor2@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 4321 0987',
                    userType: 'vendedor',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    nombre: 'Jorge Hernández',
                    email: 'vendedor3@test.com',
                    password: this.hashPassword('Test123!'),
                    telefono: '+56 9 3210 9876',
                    userType: 'vendedor',
                    fechaRegistro: new Date().toISOString()
                }
            ];

            localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
            console.log('✅ Usuarios de prueba inicializados correctamente');
        }
    }

    /**
     * Genera un ID único
     */
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Hash simple de contraseña (en producción usar bcrypt o similar)
     */
    hashPassword(password) {
        // Simulación de hash - en producción usar un algoritmo real
        return btoa(password + 'marketplace_salt');
    }

    /**
     * Obtiene todos los usuarios del localStorage
     */
    getAllUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    /**
     * Guarda todos los usuarios en localStorage
     */
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    /**
     * Registra un nuevo usuario
     */
    register(userData) {
        const users = this.getAllUsers();
        
        // Verificar si el email ya existe
        const emailExists = users.some(user => user.email.toLowerCase() === userData.email.toLowerCase());
        
        if (emailExists) {
            return {
                success: false,
                message: 'Este correo electrónico ya está registrado'
            };
        }

        // Crear nuevo usuario
        const newUser = {
            id: this.generateId(),
            nombre: userData.nombre,
            email: userData.email.toLowerCase(),
            password: this.hashPassword(userData.password),
            telefono: userData.telefono,
            userType: userData.userType,
            fechaRegistro: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return {
            success: true,
            message: 'Usuario registrado exitosamente',
            user: this.sanitizeUser(newUser)
        };
    }

    /**
     * Inicia sesión con email y contraseña
     */
    login(email, password) {
        const users = this.getAllUsers();
        const hashedPassword = this.hashPassword(password);
        
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === hashedPassword
        );

        if (!user) {
            return {
                success: false,
                message: 'Correo electrónico o contraseña incorrectos'
            };
        }

        // Guardar sesión actual
        const sanitizedUser = this.sanitizeUser(user);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sanitizedUser));

        return {
            success: true,
            message: 'Inicio de sesión exitoso',
            user: sanitizedUser
        };
    }

    /**
     * Cierra la sesión actual
     */
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        return {
            success: true,
            message: 'Sesión cerrada correctamente'
        };
    }

    /**
     * Obtiene el usuario actualmente autenticado
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Verifica si hay un usuario autenticado
     */
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Elimina la contraseña del objeto usuario (para seguridad)
     */
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    /**
     * Valida el formato de email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida la contraseña
     */
    validatePassword(password) {
        return password.length >= 6;
    }
}

// Exportar instancia única del AuthManager
export const authManager = new AuthManager();
