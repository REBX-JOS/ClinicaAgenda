// script_logIn.js
document.addEventListener('DOMContentLoaded', function () {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const linkShowRegister = document.getElementById('link-show-register');
  const linkShowLogin = document.getElementById('link-show-login');

  function showLogin(){
    // show login form, hide register
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    // move focus for accessibility
    const first = formLogin.querySelector('input');
    if (first) first.focus();
  }

  function showRegister(){
    // show register form, hide login
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    const first = formRegister.querySelector('input');
    if (first) first.focus();
  }

  // footer links toggle
  if (linkShowRegister) linkShowRegister.addEventListener('click', function(e){ e.preventDefault(); showRegister(); });
  if (linkShowLogin) linkShowLogin.addEventListener('click', function(e){ e.preventDefault(); showLogin(); });

  // Update the Bienvenido section dynamically based on the active form
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

  // Update the text when toggling forms
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

  // Set initial state based on the visible form
  updateWelcomeText(!formLogin.classList.contains('hidden'));

  // Login submit
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(formLogin);
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    // Basic client-side check
    if (!email || !password) {
      alert('Por favor completa todos los campos.');
      return;
    }
    // TODO: replace with real authentication call
    console.log('Login', { email, password });
    alert('Petición de inicio de sesión enviada (simulada).');
    formLogin.reset();
  });

  // Register submit
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
    // TODO: replace with real registration call
    console.log('Register', { fullname, email });
    alert('Registro enviado (simulado).');
    formRegister.reset();
    showLogin();
  });

  // Small keyboard accessibility: allow left/right arrow to toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLogin();
    if (e.key === 'ArrowRight') showRegister();
  });
});
