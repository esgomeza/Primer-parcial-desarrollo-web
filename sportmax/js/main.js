/* =========================================================
   SportMax — Lógica principal de la aplicación
   Archivo: js/main.js
   ========================================================= */

/* --- Estado global --- */
let todosLosProductos = []; // Todos los productos cargados desde el JSON
let carrito           = []; // Productos en el carrito

/* =========================================================
   SECCIÓN 1: CARGA DE FRAGMENTOS (Componentes HTML)
   Cada fragmento (header, sidebar, footer) es un archivo HTML
   separado que se inyecta en el DOM mediante fetch().
   ========================================================= */

/**
 * Carga un fragmento HTML desde un archivo y lo inserta en un elemento.
 * @param {string} idContenedor - ID del elemento donde se insertará.
 * @param {string} rutaArchivo  - Ruta relativa al archivo HTML.
 */
async function cargarFragmento(idContenedor, rutaArchivo) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const respuesta = await fetch(rutaArchivo);
    if (!respuesta.ok) throw new Error(`No se pudo cargar: ${rutaArchivo}`);
    const html = await respuesta.text();
    contenedor.innerHTML = html;
  } catch (error) {
    console.error(`Error cargando fragmento "${rutaArchivo}":`, error);
  }
}

/**
 * Carga todos los fragmentos de la página en paralelo y luego
 * configura los elementos que dependen de ellos (sesión, carrito).
 */
async function cargarFragmentos() {
  await Promise.all([
    cargarFragmento('contenedor-header',  'components/header.html'),
    cargarFragmento('contenedor-sidebar', 'components/sidebar.html'),
    cargarFragmento('contenedor-footer',  'components/footer.html')
  ]);

  /* Una vez cargado el header, configurar sesión y carrito */
  configurarSesion();
  configurarCarrito();
}

/* =========================================================
   SECCIÓN 2: SESIÓN DE USUARIO
   ========================================================= */

/**
 * Revisa si hay una sesión activa en sessionStorage y actualiza
 * el botón de login en el header dinámicamente.
 */
function configurarSesion() {
  const sesionGuardada = sessionStorage.getItem('sportmax_sesion');
  const btnLogin = document.getElementById('loginBtn');
  if (!btnLogin) return;

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);
    const nombreCorto = sesion.nombre.split(' ')[0];
    btnLogin.textContent = `Hola, ${nombreCorto}`;
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

/* =========================================================
   SECCIÓN 3: CARGA DE PRODUCTOS CON FETCH
   Los productos se cargan desde data/products.json usando la
   API Fetch. No se usan arreglos estáticos en el código.
   ========================================================= */

/**
 * Carga los productos desde el archivo JSON externo.
 * Usa async/await para manejar la promesa de forma legible.
 */
async function cargarProductos() {
  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar products.json');
    todosLosProductos = await respuesta.json();
    renderizarProductos(todosLosProductos);
    renderizarWebComponents(todosLosProductos.slice(0, 3)); // Primeros 3 con WC
  } catch (error) {
    console.error('Error cargando productos:', error);
    document.getElementById('gridProductos').innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--color-gray);padding:2rem;">
        ⚠️ Abre el proyecto con un servidor local (Live Server) para cargar los productos.
      </p>
    `;
  }
}

/* =========================================================
   SECCIÓN 4: RENDERIZADO CON <template>
   Se clona la plantilla definida en el HTML para crear las
   tarjetas de producto de forma dinámica.
   ========================================================= */

/**
 * Formatea un número como precio en pesos colombianos.
 * @param {number} precio
 * @returns {string}
 */
function formatearPrecio(precio) {
  return '$' + precio.toLocaleString('es-CO');
}

/**
 * Crea una tarjeta de producto clonando el <template> del HTML.
 * @param {Object} producto - Datos del producto.
 * @returns {DocumentFragment}
 */
function crearTarjetaDesdeTemplate(producto) {
  const template = document.getElementById('productoTemplate');
  const clon = template.content.cloneNode(true); // Clonar la plantilla

  /* Rellenar los campos de la plantilla */
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

  /* Badge opcional */
  const badgeEl = clon.querySelector('.product-badge');
  if (producto.badge) {
    badgeEl.textContent = producto.badge;
  } else {
    badgeEl.remove();
  }

  /* Botón añadir al carrito */
  clon.querySelector('.btn-add').addEventListener('click', () => {
    agregarAlCarrito(producto);
  });

  return clon;
}

/**
 * Renderiza todos los productos en el grid usando el <template>.
 * @param {Array} productos - Lista de productos a mostrar.
 */
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

  /* Insertar tarjetas clonadas desde el template */
  productos.forEach(producto => {
    grid.appendChild(crearTarjetaDesdeTemplate(producto));
  });
}

/* =========================================================
   SECCIÓN 5: WEB COMPONENT <producto-card>
   Los primeros 3 productos también se renderizan usando el
   Web Component personalizado con Shadow DOM.
   ========================================================= */

/**
 * Renderiza los primeros productos usando el Web Component <producto-card>.
 * @param {Array} productos - Subconjunto de productos.
 */
function renderizarWebComponents(productos) {
  const grid = document.getElementById('gridWebComponents');
  if (!grid) return;

  grid.innerHTML = '';

  productos.forEach(producto => {
    /* Crear el elemento personalizado */
    const wc = document.createElement('producto-card');

    /* Pasar datos como atributos HTML */
    wc.setAttribute('nombre',      producto.nombre);
    wc.setAttribute('precio',      producto.precio);
    wc.setAttribute('descripcion', producto.descripcion);
    wc.setAttribute('imagen',      producto.imagen);
    wc.setAttribute('categoria',   producto.categoria);
    wc.setAttribute('badge',       producto.badge || '');

    /* Escuchar el evento personalizado que emite el componente */
    wc.addEventListener('agregar-al-carrito', (e) => {
      agregarAlCarrito(e.detail);
    });

    grid.appendChild(wc);
  });
}

/* =========================================================
   SECCIÓN 6: FILTRADO POR CATEGORÍA (sidebar)
   ========================================================= */

/**
 * Filtra los productos por categoría y re-renderiza el grid.
 * Llamada desde los enlaces del sidebar.
 * @param {string}      categoria - Categoría seleccionada.
 * @param {HTMLElement} enlaceEl  - Elemento <a> clickeado.
 */
function filtrarCategoria(categoria, enlaceEl) {
  /* Actualizar estado activo en el sidebar */
  document.querySelectorAll('.sidebar-menu li a').forEach(a => {
    a.classList.remove('active');
  });
  if (enlaceEl) enlaceEl.classList.add('active');

  /* Filtrar y renderizar */
  const filtrados = categoria === 'todos'
    ? todosLosProductos
    : todosLosProductos.filter(p => p.categoria === categoria);

  renderizarProductos(filtrados);
}

/* =========================================================
   SECCIÓN 7: CARRITO DE COMPRAS
   ========================================================= */

/**
 * Agrega un producto al carrito y actualiza el contador.
 * @param {Object} producto
 */
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

/**
 * Actualiza el número visible en el botón del carrito.
 */
function actualizarContadorCarrito() {
  const contador = document.getElementById('cartCount');
  if (!contador) return;
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = total;
}

/**
 * Configura el botón del carrito del header.
 */
function configurarCarrito() {
  const btnCarrito = document.getElementById('cartBtn');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', () => {
      mostrarToast(`🛒 Tienes ${carrito.length} producto(s) en el carrito`);
    });
  }
}

/* =========================================================
   SECCIÓN 8: TOAST DE NOTIFICACIÓN
   ========================================================= */

/**
 * Muestra una notificación tipo toast en la esquina inferior derecha.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 2800);
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  /* 1. Cargar fragmentos HTML (header, sidebar, footer) */
  await cargarFragmentos();

  /* 2. Cargar productos desde JSON y renderizar */
  await cargarProductos();
});
