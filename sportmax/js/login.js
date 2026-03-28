/* =========================================================
   SportMax — Lógica del formulario de inicio de sesión
   Archivo: js/login.js

   NOTA EDUCATIVA: Las credenciales están quemadas directamente
   en el código JavaScript. Esto es únicamente con fines
   educativos. En una aplicación real, la autenticación debe
   gestionarse en el servidor con contraseñas encriptadas.
   ========================================================= */

/**
 * Credenciales válidas quemadas en el código (solo educativo).
 * En producción esto NUNCA debe hacerse así.
 * @type {{ usuario: string, password: string, nombre: string }[]}
 */
const USUARIOS_VALIDOS = [
  { usuario: 'admin',  password: '1234',      nombre: 'Administrador' },
  { usuario: 'Adrian',   password: 'deportes',  nombre: 'Adrian Navarro'    },
  { usuario: 'Santiago',  password: 'sportmax',  nombre: 'Santiago Gomez'   }
];

/* --- Referencias al DOM --- */
const loginForm   = document.getElementById('loginForm');
const inputUser   = document.getElementById('usuario');
const inputPass   = document.getElementById('password');
const errorMsg    = document.getElementById('errorMsg');

/**
 * Muestra un mensaje de error debajo del formulario.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarError(mensaje) {
  errorMsg.textContent = mensaje;
}

/**
 * Limpia el mensaje de error.
 */
function limpiarError() {
  errorMsg.textContent = '';
}

/**
 * Valida las credenciales ingresadas contra el arreglo de usuarios.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ usuario: string, nombre: string } | null}
 */
function validarCredenciales(usuario, password) {
  return USUARIOS_VALIDOS.find(
    u => u.usuario === usuario && u.password === password
  ) || null;
}

/**
 * Maneja el envío del formulario de login.
 * - Valida campos vacíos.
 * - Compara credenciales.
 * - Redirige o muestra error según el resultado.
 * @param {SubmitEvent} evento
 */
function manejarLogin(evento) {
  evento.preventDefault(); // Evitar recarga de página
  limpiarError();

  const usuarioIngresado  = inputUser.value.trim();
  const passwordIngresada = inputPass.value.trim();

  /* Validación: campos vacíos */
  if (!usuarioIngresado || !passwordIngresada) {
    mostrarError('Por favor completa todos los campos.');
    return;
  }

  /* Validación: credenciales */
  const usuarioEncontrado = validarCredenciales(usuarioIngresado, passwordIngresada);

  if (usuarioEncontrado) {
    /* Guardar sesión en sessionStorage */
    sessionStorage.setItem('sportmax_sesion', JSON.stringify({
      usuario: usuarioEncontrado.usuario,
      nombre:  usuarioEncontrado.nombre
    }));
    /* Redirigir a la página principal */
    window.location.href = 'index.html';
  } else {
    /* Credenciales incorrectas: mostrar error y limpiar contraseña */
    mostrarError('Usuario o contraseña incorrectos. Intenta de nuevo.');
    inputPass.value = '';
    inputPass.focus();
  }
}

/* --- Inicialización --- */
document.addEventListener('DOMContentLoaded', () => {
  /* Si ya hay sesión activa, redirigir directo al index */
  if (sessionStorage.getItem('sportmax_sesion')) {
    window.location.href = 'index.html';
    return;
  }

  /* Escuchar envío del formulario */
  loginForm.addEventListener('submit', manejarLogin);
});
