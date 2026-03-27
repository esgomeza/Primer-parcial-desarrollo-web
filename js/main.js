class ProductCard extends HTMLElement{

constructor(){
super();
this.attachShadow({mode:"open"});
}

connectedCallback(){

const name = this.getAttribute("name");
const price = this.getAttribute("price");
const image = this.getAttribute("image");

this.shadowRoot.innerHTML = `
<style>
.card{
border:1px solid #ccc;
padding:10px;
border-radius:10px;
text-align:center;
}
img{width:100%;}
</style>

<div class="card">
<img src="${image}">
<h3>${name}</h3>
<p>${price}</p>
</div>
`;

}

}

customElements.define("product-card", ProductCard);