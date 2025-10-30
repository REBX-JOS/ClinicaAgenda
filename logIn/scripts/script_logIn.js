// script_logIn.js
document.addEventListener('DOMContentLoaded', function () {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const linkShowRegister = document.getElementById('link-show-register');
  const linkShowLogin = document.getElementById('link-show-login');

  function showLogin(){
    // mostrar formulario de login, ocultar registro
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    // mover el foco para accesibilidad
    const first = formLogin.querySelector('input');
    if (first) first.focus();
  }

  function showRegister(){
    // mostrar formulario de registro, ocultar login
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    const first = formRegister.querySelector('input');
    if (first) first.focus();
  }

  // enlaces del pie para alternar formularios
  if (linkShowRegister) linkShowRegister.addEventListener('click', function(e){ e.preventDefault(); showRegister(); });
  if (linkShowLogin) linkShowLogin.addEventListener('click', function(e){ e.preventDefault(); showLogin(); });

  // Actualizar la sección Bienvenido dinámicamente según el formulario activo
  const headerTitle = document.querySelector('.brand h1');
  const welcomeText = document.querySelector('.Bienvenido p');

  function updateWelcomeText(isLogin) {
    if (isLogin) {
      headerTitle.textContent = 'Inicio de sesión';
      welcomeText.textContent = 'Inicia sesión para continuar';
    } else {
      headerTitle.textContent = 'Crea tu cuenta!';
      welcomeText.textContent = 'Regístrate para crear una cuenta';
    }
  }

  // Actualizar el texto al alternar entre formularios
  linkShowRegister.addEventListener('click', function (e) {
    e.preventDefault();
    showRegister();
    updateWelcomeText(false);
  });

  linkShowLogin.addEventListener('click', function (e) {
    e.preventDefault();
    showLogin();
    updateWelcomeText(true);
  });

  // Establecer estado inicial según el formulario visible
  updateWelcomeText(!formLogin.classList.contains('hidden'));

  // Envío del formulario de login
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(formLogin);
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    // Verificación básica del lado del cliente
    if (!email || !password) {
      alert('Por favor completa todos los campos.');
      return;
    }
    // TODO: reemplazar con llamada real de autenticación
    console.log('Login', { email, password });
    alert('Petición de inicio de sesión enviada (simulada).');
    formLogin.reset();
  });

  // Envío del formulario de registro
  formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(formRegister);
    const fullname = formData.get('fullname')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    const passwordConfirm = formData.get('passwordConfirm')?.trim();

    if (!fullname || !email || !password || !passwordConfirm) {
      alert('Por favor completa todos los campos.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    // TODO: reemplazar con llamada real de registro
    console.log('Register', { fullname, email });
    alert('Registro enviado (simulado).');
    formRegister.reset();
    showLogin();
  });

  // Accesibilidad de teclado: permitir flechas izquierda/derecha para alternar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLogin();
    if (e.key === 'ArrowRight') showRegister();
  });
});
