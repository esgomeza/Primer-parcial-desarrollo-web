async function loadComponent(id, file){

try{
const res = await fetch(file);
const data = await res.text();
document.getElementById(id).innerHTML = data;
}catch(error){
console.error("Error cargando componente:", error);
}

}

loadComponent("header","components/header/header.html");
loadComponent("sidebar","components/sidebar/sidebar.html");
loadComponent("footer","components/footer/footer.html");