let allProducts = [];

fetch("data/products.json")
.then(res => res.json())
.then(products => {

allProducts = products;
mostrarProductos(products);

});

function mostrarProductos(products){

const container = document.getElementById("products");
container.innerHTML = "";

const template = document.getElementById("productTemplate");

products.forEach(product => {

const clone = template.content.cloneNode(true);

clone.querySelector("img").src = product.image;
clone.querySelector(".name").textContent = product.name;
clone.querySelector(".description").textContent = product.description;
clone.querySelector(".price").textContent = "$" + product.price;

container.appendChild(clone);

});

}

function filtrar(categoria){

if(categoria === "todos"){
mostrarProductos(allProducts);
}else{
const filtrados = allProducts.filter(p => p.category === categoria);
mostrarProductos(filtrados);
}

}