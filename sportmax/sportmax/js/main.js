let todosLosProductos = [];
let carrito = [];

// carga un archivo html y lo mete en el contenedor indicado
async function cargarFragmento(idContenedor, rutaArchivo) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const respuesta = await fetch(rutaArchivo);
    if (!respuesta.ok) throw new Error(`Error cargando: ${rutaArchivo}`);
    const html = await respuesta.text();
    contenedor.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// carga los tres fragmentos al mismo tiempo
async function cargarFragmentos() {
  await Promise.all([
    cargarFragmento('contenedor-header',  'components/header.html'),
    cargarFragmento('contenedor-sidebar', 'components/sidebar.html'),
    cargarFragmento('contenedor-footer',  'components/footer.html')
  ]);

  configurarSesion();
  configurarCarrito();
}

// si hay sesion guardada, muestra el nombre en el header
function configurarSesion() {
  const sesionGuardada = sessionStorage.getItem('sportmax_sesion');
  const btnLogin = document.getElementById('loginBtn');
  if (!btnLogin) return;

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);
    const nombre = sesion.nombre.split(' ')[0];
    btnLogin.textContent = `Hola, ${nombre}`;
    btnLogin.href = '#';
    btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Deseas cerrar sesión?')) {
        sessionStorage.removeItem('sportmax_sesion');
        location.reload();
      }
    });
  }
}

// trae los productos del json con fetch
async function cargarProductos() {
  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar products.json');
    todosLosProductos = await respuesta.json();
    renderizarProductos(todosLosProductos);
    renderizarWebComponents(todosLosProductos.slice(0, 3));
  } catch (error) {
    console.error(error);
    document.getElementById('gridProductos').innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--color-gray);padding:2rem;">
        ⚠️ Abre el proyecto con Live Server para que funcione el fetch.
      </p>
    `;
  }
}

function formatearPrecio(precio) {
  return '$' + precio.toLocaleString('es-CO');
}

// crea una tarjeta clonando el template del html
function crearTarjetaDesdeTemplate(producto) {
  const template = document.getElementById('productoTemplate');
  const clon = template.content.cloneNode(true);

  const img = clon.querySelector('.product-img img');
  img.src = producto.imagen;
  img.alt = producto.nombre;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    clon.querySelector('.product-img-fallback').style.display = 'flex';
  });

  clon.querySelector('.product-cat').textContent   = producto.categoria.toUpperCase();
  clon.querySelector('.product-name').textContent  = producto.nombre;
  clon.querySelector('.product-desc').textContent  = producto.descripcion;
  clon.querySelector('.product-price').textContent = formatearPrecio(producto.precio);

  const badgeEl = clon.querySelector('.product-badge');
  if (producto.badge) {
    badgeEl.textContent = producto.badge;
  } else {
    badgeEl.remove();
  }

  clon.querySelector('.btn-add').addEventListener('click', () => {
    agregarAlCarrito(producto);
  });

  return clon;
}

function renderizarProductos(productos) {
  const grid   = document.getElementById('gridProductos');
  const conteo = document.getElementById('conteoProductos');
  if (!grid) return;

  if (conteo) conteo.textContent = `${productos.length} productos`;

  grid.innerHTML = '';

  if (productos.length === 0) {
    grid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--color-gray);padding:2rem;">
        No hay productos en esta categoría.
      </p>
    `;
    return;
  }

  productos.forEach(producto => {
    grid.appendChild(crearTarjetaDesdeTemplate(producto));
  });
}

// renderiza los primeros 3 productos usando el web component
function renderizarWebComponents(productos) {
  const grid = document.getElementById('gridWebComponents');
  if (!grid) return;

  grid.innerHTML = '';

  productos.forEach(producto => {
    const wc = document.createElement('producto-card');
    wc.setAttribute('nombre',      producto.nombre);
    wc.setAttribute('precio',      producto.precio);
    wc.setAttribute('descripcion', producto.descripcion);
    wc.setAttribute('imagen',      producto.imagen);
    wc.setAttribute('categoria',   producto.categoria);
    wc.setAttribute('badge',       producto.badge || '');

    wc.addEventListener('agregar-al-carrito', (e) => {
      agregarAlCarrito(e.detail);
    });

    grid.appendChild(wc);
  });
}

// filtra por categoria desde el sidebar
function filtrarCategoria(categoria, enlaceEl) {
  document.querySelectorAll('.sidebar-menu li a').forEach(a => {
    a.classList.remove('active');
  });
  if (enlaceEl) enlaceEl.classList.add('active');

  const filtrados = categoria === 'todos'
    ? todosLosProductos
    : todosLosProductos.filter(p => p.categoria === categoria);

  renderizarProductos(filtrados);
}

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.nombre === producto.nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarToast(`✅ ${producto.nombre} agregado`);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('cartCount');
  if (!contador) return;
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = total;
}

function configurarCarrito() {
  const btnCarrito = document.getElementById('cartBtn');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', () => {
      mostrarToast(`🛒 Tienes ${carrito.length} producto(s) en el carrito`);
    });
  }
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 2800);
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarFragmentos();
  await cargarProductos();
});
