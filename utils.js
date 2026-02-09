// ===================================
// MÓDULO DE UTILIDADES
// ===================================

/**
 * Muestra un mensaje de error en el formulario
 */
export function showError(message, elementId = 'errorMessage') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            hideError(elementId);
        }, 5000);
    }
}

/**
 * Oculta el mensaje de error
 */
export function hideError(elementId = 'errorMessage') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

/**
 * Muestra un mensaje de éxito en el formulario
 */
export function showSuccess(message, elementId = 'successMessage') {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            hideSuccess(elementId);
        }, 5000);
    }
}

/**
 * Oculta el mensaje de éxito
 */
export function hideSuccess(elementId = 'successMessage') {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.classList.remove('show');
        successElement.textContent = '';
    }
}

/**
 * Valida un formulario y retorna los datos
 */
export function getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    return data;
}

/**
 * Limpia todos los campos de un formulario
 */
export function clearForm(formElement) {
    formElement.reset();
}

/**
 * Valida que un campo no esté vacío
 */
export function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return {
            valid: false,
            message: `El campo ${fieldName} es obligatorio`
        };
    }
    return { valid: true };
}

/**
 * Valida el formato de email
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            valid: false,
            message: 'El formato del correo electrónico no es válido'
        };
    }
    return { valid: true };
}

/**
 * Valida la longitud mínima de contraseña
 */
export function validatePassword(password, minLength = 6) {
    if (password.length < minLength) {
        return {
            valid: false,
            message: `La contraseña debe tener al menos ${minLength} caracteres`
        };
    }
    return { valid: true };
}

/**
 * Valida que dos contraseñas coincidan
 */
export function validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
        return {
            valid: false,
            message: 'Las contraseñas no coinciden'
        };
    }
    return { valid: true };
}

/**
 * Redirecciona a una página específica
 */
export function redirect(url, delay = 0) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Previene el envío múltiple de formularios
 */
export function preventMultipleSubmits(button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Procesando...';
    
    return () => {
        button.disabled = false;
        button.textContent = originalText;
    };
}

/**
 * Sanitiza strings para prevenir XSS básico
 */
export function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Valida un número de teléfono chileno básico
 */
export function validatePhone(phone) {
    // Acepta formatos como: +56912345678, +56 9 1234 5678, 912345678
    const phoneRegex = /^(\+?56)?[\s]?9[\s]?\d{4}[\s]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
        return {
            valid: false,
            message: 'El formato del teléfono no es válido (ejemplo: +56 9 1234 5678)'
        };
    }
    return { valid: true };
}

/**
 * Agrega un listener de evento de forma segura
 */
export function addEventListenerSafe(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
        return true;
    }
    console.warn(`Elemento no encontrado para agregar listener: ${event}`);
    return false;
}

/**
 * Obtiene un parámetro de la URL
 */
export function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Verifica si el usuario está en dispositivo móvil
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
