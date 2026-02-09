/**
 * Lógica del Dashboard/Home
 */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si hay sesión activa
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    // Si no hay sesión, redirigir al login
    window.location.href = 'login.html';
    return;
  }
  
  // Renderizar información del usuario
  renderDashboard(currentUser);
});

function renderDashboard(user) {
  const userInfoEl = document.getElementById('user-info');
  const badgeEl = document.getElementById('user-type-badge');
  
  userInfoEl.innerHTML = `
    <p><strong>Nombre:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Teléfono:</strong> ${user.phone || 'No proporcionado'}</p>
  `;
  
  if (user.userType === 'buyer') {
    badgeEl.innerHTML = '<span class="badge buyer">🛒 Comprador</span>';
  } else {
    badgeEl.innerHTML = `
      <span class="badge seller">💼 Vendedor</span>
      <p style="margin-top:10px"><strong>Negocio:</strong> ${user.businessName || 'No especificado'}</p>
      ${user.taxId ? `<p><strong>RUC:</strong> ${user.taxId}</p>` : ''}
    `;
  }
}

function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    AuthService.logout();
    window.location.href = 'index.html';
  }
}
