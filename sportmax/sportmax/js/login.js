// credenciales quemadas - solo educativo, no usar en produccion
const USUARIOS_VALIDOS = [
  { usuario: 'admin', password: '1234',     nombre: 'Administrador' },
  { usuario: 'juan',  password: 'deportes', nombre: 'Juan Pérez'    },
  { usuario: 'maria', password: 'sportmax', nombre: 'María López'   }
];

const loginForm = document.getElementById('loginForm');
const inputUser = document.getElementById('usuario');
const inputPass = document.getElementById('password');
const errorMsg  = document.getElementById('errorMsg');

function mostrarError(mensaje) {
  errorMsg.textContent = mensaje;
}

function limpiarError() {
  errorMsg.textContent = '';
}

function validarCredenciales(usuario, password) {
  return USUARIOS_VALIDOS.find(
    u => u.usuario === usuario && u.password === password
  ) || null;
}

function manejarLogin(evento) {
  evento.preventDefault();
  limpiarError();

  const usuarioIngresado  = inputUser.value.trim();
  const passwordIngresada = inputPass.value.trim();

  if (!usuarioIngresado || !passwordIngresada) {
    mostrarError('Por favor completa todos los campos.');
    return;
  }

  const usuarioEncontrado = validarCredenciales(usuarioIngresado, passwordIngresada);

  if (usuarioEncontrado) {
    // guardar sesion y redirigir
    sessionStorage.setItem('sportmax_sesion', JSON.stringify({
      usuario: usuarioEncontrado.usuario,
      nombre:  usuarioEncontrado.nombre
    }));
    window.location.href = 'index.html';
  } else {
    mostrarError('Usuario o contraseña incorrectos. Intenta de nuevo.');
    inputPass.value = '';
    inputPass.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // si ya hay sesion activa, ir directo al index
  if (sessionStorage.getItem('sportmax_sesion')) {
    window.location.href = 'index.html';
    return;
  }
  loginForm.addEventListener('submit', manejarLogin);
});
