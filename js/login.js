function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        alert('Inicio de sesión exitoso');
    } else {
        alert('Datos incorrectos');
    }
}
