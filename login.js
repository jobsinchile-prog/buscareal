// ===================================
// SCRIPT DE INICIO DE SESIÓN
// ===================================

import { authManager } from './auth.js';
import { 
    showError, 
    hideError, 
    getFormData, 
    validateEmail,
    validateRequired,
    redirect,
    preventMultipleSubmits
} from './utils.js';

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay un usuario autenticado
    if (authManager.isAuthenticated()) {
        redirect('pages/home.html');
        return;
    }

    initializeLoginForm();
});

/**
 * Inicializa el formulario de login
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Formulario de login no encontrado');
        return;
    }

    loginForm.addEventListener('submit', handleLogin);
}

/**
 * Maneja el envío del formulario de login
 */
async function handleLogin(event) {
    event.preventDefault();
    hideError();

    const form = event.target;
    const formData = getFormData(form);
    const restoreButton = preventMultipleSubmits(form.querySelector('button[type="submit"]'));

    try {
        // Validar campos
        const emailValidation = validateRequired(formData.email, 'Correo electrónico');
        if (!emailValidation.valid) {
            showError(emailValidation.message);
            restoreButton();
            return;
        }

        const emailFormatValidation = validateEmail(formData.email);
        if (!emailFormatValidation.valid) {
            showError(emailFormatValidation.message);
            restoreButton();
            return;
        }

        const passwordValidation = validateRequired(formData.password, 'Contraseña');
        if (!passwordValidation.valid) {
            showError(passwordValidation.message);
            restoreButton();
            return;
        }

        // Intentar iniciar sesión
        const result = authManager.login(formData.email, formData.password);

        if (result.success) {
            console.log('✅ Login exitoso:', result.user);
            
            // Mostrar mensaje de éxito brevemente
            showSuccess('¡Bienvenido! Redirigiendo...');
            
            // Redireccionar después de 1 segundo
            setTimeout(() => {
                redirect('pages/home.html');
            }, 1000);
        } else {
            showError(result.message);
            restoreButton();
        }
    } catch (error) {
        console.error('Error en login:', error);
        showError('Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.');
        restoreButton();
    }
}

// Agregar mensaje de éxito si viene desde registro
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
    setTimeout(() => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        
        const form = document.getElementById('loginForm');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 5000);
        }
    }, 500);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv && errorDiv.parentNode) {
        errorDiv.parentNode.insertBefore(successDiv, errorDiv);
    }
}
