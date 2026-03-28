let carrito = [];

/**
 * Muestra un toast de notificación
 * @param {string} mensaje
 */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/**
 * Agrega un producto al carrito
 * @param {Object} producto
 */
function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarToast(`✅ ${producto.nombre} agregado al carrito`);
}

/**
 * Elimina un producto del carrito
 * @param {number} id
 */
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarContadorCarrito();
  renderizarCarrito();
}

/**
 * Actualiza el número visible en el botón del carrito
 */
function actualizarContadorCarrito() {
  const count = document.getElementById('cartCount');
  if (!count) return;
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  count.textContent = total;
}

/**
 * Calcula el total del carrito
 * @returns {number}
 */
function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

/**
 * Renderiza los items del carrito en el modal
 */
function renderizarCarrito() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  if (carrito.length === 0) {
    container.innerHTML = '<p class="cart-empty">Tu carrito está vacío 🛒</p>';
    if (totalEl) totalEl.textContent = '$0';
    return;
  }

  container.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}</div>
        <div class="cart-item-price">
          ${item.cantidad} × $${item.precio.toLocaleString('es-CO')}
        </div>
      </div>
      <button class="cart-item-remove" onclick="eliminarDelCarrito(${item.id})">✕</button>
    </div>
  `).join('');

  if (totalEl) {
    totalEl.textContent = '$' + calcularTotal().toLocaleString('es-CO');
  }
}

/**
 * Abre el modal del carrito
 */
function abrirCarrito() {
  renderizarCarrito();
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.add('open');
}

/**
 * Cierra el modal del carrito
 */
function cerrarCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('open');
}

/**
 * Simula el proceso de compra
 */
function checkout() {
  if (carrito.length === 0) {
    mostrarToast('⚠️ Agrega productos antes de comprar');
    return;
  }
  carrito = [];
  actualizarContadorCarrito();
  cerrarCarrito();
  mostrarToast('🎉 ¡Compra realizada con éxito! Gracias por tu pedido.');
}
