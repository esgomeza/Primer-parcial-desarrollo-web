document.addEventListener('DOMContentLoaded', () => {
  // 1. Renderizar componentes
  renderHeader();
  renderFooter();
  renderCartModal();
  renderToast();

  // 2. Cargar productos desde JSON
  cargarProductos();

  // 3. Revisar si hay sesión iniciada
  const usuario = sessionStorage.getItem('sportmax_usuario');
  if (usuario) {
    const btnLogin = document.querySelector('.btn-login');
    if (btnLogin) {
      const datos = JSON.parse(usuario);
      btnLogin.textContent = `Hola, ${datos.nombre.split(' ')[0]}`;
      btnLogin.href = '#';
      btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Deseas cerrar sesión?')) {
          sessionStorage.removeItem('sportmax_usuario');
          location.reload();
        }
      });
    }
  }
