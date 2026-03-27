const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const usuario = document.getElementById("usuario").value;
const password = document.getElementById("password").value;

if(usuario === "admin" && password === "1234"){
window.location.href = "index.html";
}else{
const error = document.getElementById("error");
error.textContent = "Datos incorrectos";
error.style.color = "red";
}

});