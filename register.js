// ===================================
// SCRIPT DE REGISTRO
// ===================================

import { authManager } from '../js/auth.js';
import { 
    showError, 
    hideError,
    showSuccess,
    hideSuccess,
    getFormData,
    validateRequired,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validatePhone,
    redirect,
    preventMultipleSubmits,
    clearForm
} from '../js/utils.js';

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay un usuario autenticado
    if (authManager.isAuthenticated()) {
        redirect('../pages/home.html');
        return;
    }

    initializeRegisterForm();
});

/**
 * Inicializa el formulario de registro
 */
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.error('Formulario de registro no encontrado');
        return;
    }

    registerForm.addEventListener('submit', handleRegister);
    
    // Validación en tiempo real de contraseñas
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
    }
}

/**
 * Maneja el envío del formulario de registro
 */
async function handleRegister(event) {
    event.preventDefault();
    hideError();
    hideSuccess();

    const form = event.target;
    const formData = getFormData(form);
    const restoreButton = preventMultipleSubmits(form.querySelector('button[type="submit"]'));

    try {
        // Validar todos los campos
        const validation = validateFormData(formData);
        
        if (!validation.valid) {
            showError(validation.message);
            restoreButton();
            return;
        }

        // Verificar términos y condiciones
        if (!form.terms.checked) {
            showError('Debes aceptar los términos y condiciones');
            restoreButton();
            return;
        }

        // Preparar datos del usuario
        const userData = {
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            userType: formData.userType
        };

        // Intentar registrar
        const result = authManager.register(userData);

        if (result.success) {
            console.log('✅ Registro exitoso:', result.user);
            
            // Mostrar mensaje de éxito
            showSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
            
            // Limpiar formulario
            clearForm(form);
            
            // Redireccionar después de 2 segundos
            setTimeout(() => {
                redirect('../index.html?registered=true');
            }, 2000);
        } else {
            showError(result.message);
            restoreButton();
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showError('Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.');
        restoreButton();
    }
}

/**
 * Valida todos los datos del formulario
 */
function validateFormData(formData) {
    // Validar nombre
    const nameValidation = validateRequired(formData.nombre, 'Nombre completo');
    if (!nameValidation.valid) {
        return nameValidation;
    }

    if (formData.nombre.length < 3) {
        return {
            valid: false,
            message: 'El nombre debe tener al menos 3 caracteres'
        };
    }

    // Validar email
    const emailValidation = validateRequired(formData.email, 'Correo electrónico');
    if (!emailValidation.valid) {
        return emailValidation;
    }

    const emailFormatValidation = validateEmail(formData.email);
    if (!emailFormatValidation.valid) {
        return emailFormatValidation;
    }

    // Validar contraseña
    const passwordValidation = validateRequired(formData.password, 'Contraseña');
    if (!passwordValidation.valid) {
        return passwordValidation;
    }

    const passwordStrengthValidation = validatePassword(formData.password);
    if (!passwordStrengthValidation.valid) {
        return passwordStrengthValidation;
    }

    // Validar confirmación de contraseña
    const passwordMatchValidation = validatePasswordMatch(
        formData.password, 
        formData.confirmPassword
    );
    if (!passwordMatchValidation.valid) {
        return passwordMatchValidation;
    }

    // Validar teléfono
    const phoneValidation = validateRequired(formData.telefono, 'Teléfono');
    if (!phoneValidation.valid) {
        return phoneValidation;
    }

    const phoneFormatValidation = validatePhone(formData.telefono);
    if (!phoneFormatValidation.valid) {
        return phoneFormatValidation;
    }

    // Validar tipo de usuario
    const userTypeValidation = validateRequired(formData.userType, 'Tipo de usuario');
    if (!userTypeValidation.valid) {
        return userTypeValidation;
    }

    if (!['comprador', 'vendedor'].includes(formData.userType)) {
        return {
            valid: false,
            message: 'Debes seleccionar un tipo de usuario válido'
        };
    }

    return { valid: true };
}
