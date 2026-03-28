
class ProductoCard extends HTMLElement {

  /**
   * Atributos observados: cuando cambian, se llama attributeChangedCallback.
   */
  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'imagen', 'categoria', 'badge'];
  }

  constructor() {
    super();
    /* Crear el Shadow DOM en modo abierto */
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Se ejecuta cuando el componente es insertado en el DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Se ejecuta cuando cambia algún atributo observado.
   */
  attributeChangedCallback() {
    this.render();
  }

  /**
   * Formatea el precio como peso colombiano.
   * @param {string|number} precio
   * @returns {string}
   */
  formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-CO');
  }

  /**
   * Renderiza el HTML y los estilos encapsulados del componente.
   * Los estilos dentro del Shadow DOM NO afectan al resto de la página.
   */
  render() {
    /* Leer atributos del elemento */
    const nombre      = this.getAttribute('nombre')      || 'Producto';
    const precio      = this.getAttribute('precio')      || '0';
    const descripcion = this.getAttribute('descripcion') || '';
    const imagen      = this.getAttribute('imagen')      || '';
    const categoria   = this.getAttribute('categoria')   || '';
    const badge       = this.getAttribute('badge')       || '';

    /* Estilos encapsulados en Shadow DOM */
    const estilos = `
      <style>
        /* Importar fuentes dentro del shadow root */
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        :host {
          display: block;
        }

        .wc-card {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e8e5de;
          font-family: 'DM Sans', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .wc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        /* Imagen */
        .wc-img {
          height: 200px;
          overflow: hidden;
          background: #f0ede6;
          position: relative;
        }

        .wc-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .wc-card:hover .wc-img img {
          transform: scale(1.05);
        }

        /* Badge Web Component — borde azul para diferenciarlo */
        .wc-label {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #1a56db;
          color: white;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 4px;
        }

        .wc-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #e63329;
          color: white;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 4px;
        }

        /* Info */
        .wc-info {
          padding: 1rem 1.1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .wc-cat {
          font-size: 0.68rem;
          font-weight: 600;
          color: #8a8a80;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 4px;
        }

        .wc-nombre {
          font-size: 0.96rem;
          font-weight: 600;
          color: #0d0d0d;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .wc-desc {
          font-size: 0.79rem;
          color: #8a8a80;
          line-height: 1.5;
          flex: 1;
          margin-bottom: 1rem;
        }

        .wc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wc-precio {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          color: #0d0d0d;
          letter-spacing: 0.02em;
        }

        .wc-btn {
          background: #1a56db;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 7px 13px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }

        .wc-btn:hover {
          background: #1440b5;
        }
      </style>
    `;

    /* HTML del componente */
    this.shadow.innerHTML = `
      ${estilos}
      <div class="wc-card">
        <div class="wc-img">
          <img src="${imagen}" alt="${nombre}" loading="lazy">
          <span class="wc-label">Web Component</span>
          ${badge ? `<span class="wc-badge">${badge}</span>` : ''}
        </div>
        <div class="wc-info">
          <div class="wc-cat">${categoria}</div>
          <div class="wc-nombre">${nombre}</div>
          <div class="wc-desc">${descripcion}</div>
          <div class="wc-footer">
            <span class="wc-precio">${this.formatearPrecio(precio)}</span>
            <button class="wc-btn" id="btnAgregar">+ Añadir</button>
          </div>
        </div>
      </div>
    `;

    /* Evento del botón dentro del Shadow DOM */
    this.shadow.getElementById('btnAgregar').addEventListener('click', () => {
      /* Disparar evento personalizado que puede escucharse fuera del shadow */
      this.dispatchEvent(new CustomEvent('agregar-al-carrito', {
        bubbles: true,
        composed: true, // Cruza la barrera del Shadow DOM
        detail: { nombre, precio: Number(precio), imagen, categoria }
      }));
    });
  }
}

/* Registrar el Web Component con el nombre <producto-card> */
customElements.define('producto-card', ProductoCard);



