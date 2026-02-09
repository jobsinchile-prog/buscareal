# 🛒 Marketplace - Sistema de Autenticación

Sistema completo de registro e inicio de sesión para una plataforma de marketplace que conecta compradores y vendedores.

## 📋 Características

- ✅ Sistema completo de registro de usuarios
- ✅ Autenticación segura con login
- ✅ Diferenciación entre Compradores y Vendedores
- ✅ Validación de formularios en tiempo real
- ✅ Persistencia de datos con localStorage
- ✅ 6 usuarios de prueba precargados
- ✅ Diseño moderno y responsivo
- ✅ Arquitectura modular y escalable
- ✅ Protección de rutas y sesiones

## 🚀 Usuarios de Prueba

El sistema viene con 6 usuarios precargados para facilitar las pruebas:

### Compradores
- **Email:** comprador1@test.com | **Contraseña:** Test123!
- **Email:** comprador2@test.com | **Contraseña:** Test123!
- **Email:** comprador3@test.com | **Contraseña:** Test123!

### Vendedores
- **Email:** vendedor1@test.com | **Contraseña:** Test123!
- **Email:** vendedor2@test.com | **Contraseña:** Test123!
- **Email:** vendedor3@test.com | **Contraseña:** Test123!

## 📁 Estructura del Proyecto

```
marketplace-auth/
│
├── index.html                 # Página principal (Login)
├── README.md                  # Este archivo
│
├── css/
│   └── styles.css            # Estilos principales del proyecto
│
├── js/
│   ├── auth.js               # Módulo de autenticación
│   ├── utils.js              # Funciones utilitarias
│   ├── login.js              # Lógica de inicio de sesión
│   ├── register.js           # Lógica de registro
│   └── home.js               # Lógica de página principal
│
└── pages/
    ├── register.html         # Página de registro
    └── home.html             # Página de inicio (post-login)
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con gradientes y animaciones
- **JavaScript ES6+** - Módulos, clases y funciones modernas
- **LocalStorage** - Persistencia de datos del lado del cliente

## 💻 Instalación y Uso

### Opción 1: Servidor Local Simple

1. Clona o descarga el repositorio:
```bash
git clone [URL-del-repositorio]
cd marketplace-auth
```

2. Inicia un servidor HTTP local. Puedes usar cualquiera de estas opciones:

**Con Python 3:**
```bash
python -m http.server 8000
```

**Con Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Con Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

3. Abre tu navegador en `http://localhost:8000`

### Opción 2: Extensión Live Server (VSCode)

1. Instala la extensión "Live Server" en Visual Studio Code
2. Abre la carpeta del proyecto en VSCode
3. Haz clic derecho en `index.html` y selecciona "Open with Live Server"

### Opción 3: Subir a GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama main y carpeta root
4. Guarda y espera unos minutos
5. Accede a `https://tu-usuario.github.io/nombre-repositorio`

## 📖 Guía de Uso

### Registro de Nuevo Usuario

1. Desde la página de login, haz clic en "Regístrate aquí"
2. Completa el formulario con:
   - Nombre completo (mínimo 3 caracteres)
   - Correo electrónico válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmación de contraseña
   - Teléfono
   - Tipo de usuario (Comprador o Vendedor)
3. Acepta los términos y condiciones
4. Haz clic en "Registrarse"
5. Serás redirigido automáticamente al login

### Inicio de Sesión

1. Ingresa tu correo electrónico
2. Ingresa tu contraseña
3. Haz clic en "Ingresar"
4. Serás redirigido a la página de inicio

### Cerrar Sesión

1. Desde la página de inicio, haz clic en "Cerrar Sesión"
2. Confirma la acción
3. Serás redirigido al login

## 🔒 Seguridad

- **Validación de formularios**: Validación tanto en cliente como en la lógica de negocio
- **Hash de contraseñas**: Las contraseñas se hashean antes de almacenarse (simulado con btoa)
- **Sanitización de datos**: Prevención básica de XSS
- **Protección de rutas**: Redirección automática si no está autenticado
- **Gestión de sesiones**: Control de sesiones con localStorage

> ⚠️ **Nota de Producción**: Este sistema usa localStorage y hash básico para demostración. En producción, se debe implementar:
> - Backend con base de datos segura
> - Bcrypt o Argon2 para hash de contraseñas
> - Tokens JWT o sesiones del servidor
> - HTTPS obligatorio
> - Validación del lado del servidor

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Color principal */
    --primary-dark: #1e40af;       /* Color primario oscuro */
    --primary-light: #3b82f6;      /* Color primario claro */
    /* ... más variables ... */
}
```

### Modificar Validaciones

Las validaciones están en `js/utils.js`. Puedes ajustar:

```javascript
// Cambiar longitud mínima de contraseña
export function validatePassword(password, minLength = 6) {
    // Tu lógica aquí
}

// Modificar validación de teléfono
export function validatePhone(phone) {
    // Tu regex aquí
}
```

## 🔧 Módulos Principales

### auth.js
Gestiona toda la lógica de autenticación:
- Registro de usuarios
- Login/Logout
- Verificación de sesiones
- Gestión de usuarios en localStorage

### utils.js
Funciones utilitarias reutilizables:
- Validaciones de formularios
- Mensajes de error/éxito
- Formateo de datos
- Redirecciones

### login.js
Lógica específica de la página de login:
- Manejo del formulario de login
- Validación de credenciales
- Redirección post-login

### register.js
Lógica específica de la página de registro:
- Manejo del formulario de registro
- Validación completa de datos
- Creación de nuevos usuarios

### home.js
Lógica de la página principal:
- Verificación de autenticación
- Mostrar información del usuario
- Manejo de logout

## 📱 Responsive Design

El sistema es completamente responsive y se adapta a:
- 📱 Dispositivos móviles (< 480px)
- 📱 Tablets (480px - 768px)
- 💻 Escritorio (> 768px)

## 🐛 Solución de Problemas

### El sistema no carga

- Asegúrate de estar usando un servidor HTTP (no abras el archivo directamente)
- Verifica que todos los archivos estén en sus carpetas correspondientes
- Revisa la consola del navegador para ver errores

### Los usuarios de prueba no funcionan

- Abre la consola del navegador (F12)
- Ve a "Application" → "Local Storage"
- Borra todos los datos de `marketplace_users` y `marketplace_current_user`
- Recarga la página

### El formulario no valida correctamente

- Verifica que JavaScript esté habilitado en tu navegador
- Revisa la consola para ver posibles errores
- Asegúrate de que los módulos JS se estén cargando correctamente

## 🚀 Próximos Pasos (Roadmap)

- [ ] Implementación de backend (Node.js/Express)
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Sistema de recuperación de contraseña
- [ ] Autenticación con redes sociales
- [ ] Verificación de email
- [ ] Panel de administración
- [ ] Dashboard de usuario personalizado
- [ ] Sistema de mensajería entre usuarios
- [ ] Gestión de productos/servicios
- [ ] Sistema de pagos

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

## 👨‍💻 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para la comunidad de desarrollo web**
