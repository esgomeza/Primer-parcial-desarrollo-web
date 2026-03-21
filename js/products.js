const products = [
    {
        id: 1,
        name: "Camiseta Deportiva",
        price: $139950,
        image: "images/camiseta.jpg",
        description: "Camiseta de alta calidad para tus entrenamientos."
    },
    {

        id: 2,  
        name: "Pantalones Cortos",
        price: $199950,
        image: "images/pantalones.jpg",
        description: "Pantalones cortos cómodos y transpirables."
    },
    {
        id: 3,
        name: "Zapatillas de Running",
        price: $259950,
        image: "images/zapatillas.jpg",
        description: "Zapatillas de running con amortiguación y soporte."
    },
    {
        id: 4,  
        name: "Sudadera con Capucha",
        price: $219950,
        image: "images/sudadera.jpg",
        description: "Sudadera con capucha para mantenerte abrigado."
    },
    {
        id: 5,  
        name: "Gorra Deportiva",
        price: $179950,
        image: "images/gorra.jpg",
        description: "Gorra deportiva para protegerte del sol."
    },
    {
        id: 6,
        name: "Guayos",
        price: $159950,
        image: "images/guayos.jpg",
        description: "Guayos cómodos para tus actividades deportivas."
    },   
    {
    id: 7,
        name: "Balon de Futbol ",
        price: $319950,
    },

];

function displayProducts() {
    const productContainer = document.getElementById("product-container");
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>   
            <span class="price">$${ 
                product.price.toFixed(2)    
            }</span>    
            <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
        `;
        productContainer.appendChild(productCard);
    }       
    );

    // Agregar evento a los botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            addToCart(productId);
        }); 
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        alert(`Producto "${product.name}" agregado al carrito.`);
    }
}

// Mostrar los productos al cargar la página
document.addEventListener("DOMContentLoaded", displayProducts);

    