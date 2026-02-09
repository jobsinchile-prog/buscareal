/**
 * Lógica de Registro de Usuarios
 */

// Obtener tipo de usuario de la URL
const urlParams = new URLSearchParams(window.location.search);
const userType = urlParams.get('type') || 'buyer';

// Actualizar UI según el tipo de usuario
document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('register-title');
  const subtitle = document.getElementById('register-subtitle');
  const sellerFields = document.getElementById('seller-fields');
  const businessInput = document.getElementById('business-name');
  
  document.getElementById('user-type').value = userType;
  
  if (userType === 'buyer') {
    title.textContent = 'Registro de Comprador';
    subtitle.textContent = 'Crea tu cuenta para comenzar';
    sellerFields.style.display = 'none';
    businessInput.required = false;
  } else {
    title.textContent = 'Registro de Vendedor';
    subtitle.textContent = 'Registra tu negocio y comienza a vender';
    sellerFields.style.display = 'block';
    businessInput.required = true;
  }
  
  // Limpiar mensajes
  hideMessage('register-error');
  hideMessage('register-success');
});

// Manejar el formulario de registro
document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  hideMessage('register-error');
  hideMessage('register-success');
  
  const form = e.target;
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    confirmPassword: form['confirm-password'].value,
    phone: form.phone.value.trim(),
    userType: userType
  };
  
  // Validaciones
  if (formData.password !== formData.confirmPassword) {
    showMessage('register-error', 'Las contraseñas no coinciden');
    return;
  }
  
  if (formData.password.length < 6) {
    showMessage('register-error', 'La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  if (!form.terms.checked) {
    showMessage('register-error', 'Debes aceptar los términos y condiciones');
    return;
  }
  
  // Campos de vendedor
  if (userType === 'seller') {
    const businessName = document.getElementById('business-name').value.trim();
    if (!businessName) {
      showMessage('register-error', 'El nombre del negocio es requerido');
      return;
    }
    formData.businessName = businessName;
    formData.taxId = document.getElementById('tax-id').value.trim();
  }
  
  try {
    // Registrar usuario
    await AuthService.register(formData);
    
    showMessage('register-success', '¡Registro exitoso! Redirigiendo al login...');
    
    // Limpiar formulario y redirigir después de 1.5 segundos
    setTimeout(() => {
      form.reset();
      window.location.href = 'login.html';
    }, 1500);
    
  } catch (error) {
    showMessage('register-error', error.message || 'Error en el registro');
    console.error('Error de registro:', error);
  }
});

// ========== Funciones Helper ==========
function showMessage(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = `message ${type}`;
  el.style.display = 'block';
}

function hideMessage(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.display = 'none';
  }
}
