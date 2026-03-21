async function loadComponent(id, file) {
    const res = await fetch(file);
    const data = await res.text();
    document.getElementById(id).innerHTML = data;
}
// cargar componentes 
loadcomponent('header', 'components/header.html');
loadComponent('footer', 'components/footer.html');
loadComponent('sidebar', 'components/sidebar.html');