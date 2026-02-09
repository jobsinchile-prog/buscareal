/**
 * Lógica de Login/Inicio de Sesión
 */

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  hideMessage('login-error');
  hideMessage('login-success');
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  try {
    // Verificar que bcrypt esté disponible
    if (!AuthService.isBcryptAvailable()) {
      throw new Error('bcrypt no está disponible. Por favor recarga la página.');
    }
    
    // Intentar login
    const user = await AuthService.login(email, password);
    
    showMessage('login-success', '¡Inicio de sesión exitoso!', 'success');
    
    // Redirigir al dashboard después de un breve delay
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 800);
    
  } catch (error) {
    showMessage('login-error', error.message || 'Credenciales incorrectas');
    console.error('Error de login:', error);
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
