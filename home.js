// ===================================
// SCRIPT DE PÁGINA HOME
// ===================================

import { authManager } from '../js/auth.js';
import { redirect, capitalize, formatDate } from '../js/utils.js';

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    if (!authManager.isAuthenticated()) {
        redirect('../index.html');
        return;
    }

    initializeHomePage();
    setupLogout();
});

/**
 * Inicializa la página de inicio
 */
function initializeHomePage() {
    const currentUser = authManager.getCurrentUser();
    
    if (!currentUser) {
        redirect('../index.html');
        return;
    }

    displayUserInfo(currentUser);
    displayUserDetails(currentUser);
}

/**
 * Muestra la información del usuario en el navbar
 */
function displayUserInfo(user) {
    const userInfoElement = document.getElementById('userInfo');
    
    if (userInfoElement) {
        const userType = capitalize(user.userType);
        userInfoElement.innerHTML = `
            <span style="color: #2563eb;">●</span> ${user.nombre} 
            <span style="font-weight: 400; color: #64748b;">(${userType})</span>
        `;
    }
}

/**
 * Muestra los detalles completos del usuario
 */
function displayUserDetails(user) {
    const userDetailsElement = document.getElementById('userDetails');
    
    if (userDetailsElement) {
        const userType = capitalize(user.userType);
        const registrationDate = formatDate(user.fechaRegistro);
        
        userDetailsElement.innerHTML = `
            <p><strong>Nombre:</strong> ${user.nombre}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Teléfono:</strong> ${user.telefono}</p>
            <p><strong>Tipo de cuenta:</strong> ${userType}</p>
            <p><strong>Miembro desde:</strong> ${registrationDate}</p>
            <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem;">
                <strong>ID de usuario:</strong> ${user.id}
            </p>
        `;
    }
}

/**
 * Configura el botón de cerrar sesión
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Maneja el cierre de sesión
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Confirmar cierre de sesión
    const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmLogout) {
        const result = authManager.logout();
        
        if (result.success) {
            console.log('✅ Sesión cerrada correctamente');
            
            // Redireccionar al login
            redirect('../index.html');
        } else {
            console.error('Error al cerrar sesión');
            alert('Hubo un error al cerrar sesión. Por favor, intenta nuevamente.');
        }
    }
}

/**
 * Protección adicional contra acceso no autorizado
 */
window.addEventListener('storage', (event) => {
    // Si se borra la sesión en otra pestaña, redireccionar
    if (event.key === 'marketplace_current_user' && !event.newValue) {
        redirect('../index.html');
    }
});
