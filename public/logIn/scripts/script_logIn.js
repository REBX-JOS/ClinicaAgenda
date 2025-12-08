document.addEventListener('DOMContentLoaded', function () {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formRecover = document.getElementById('form-recover');
  const linkShowRegister = document.getElementById('link-show-register');
  const linkShowLogin = document.getElementById('link-show-login');
  const linkShowLogin2 = document.getElementById('link-show-login2');
  const btnForgot = document.getElementById('forgot');
  const feedbackMsg = document.getElementById('feedbackMsg');

  function showLogin(){
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    formRecover.classList.add('hidden');
    feedbackMsg.textContent = '';
    const first = formLogin.querySelector('input');
    if (first) first.focus();
    updateWelcomeText(true);
  }

  function showRegister(){
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    formRecover.classList.add('hidden');
    feedbackMsg.textContent = '';
    const first = formRegister.querySelector('input');
    if (first) first.focus();
    updateWelcomeText(false);
  }

  function showRecover(){
    formRecover.classList.remove('hidden');
    formLogin.classList.add('hidden');
    formRegister.classList.add('hidden');
    feedbackMsg.textContent = '';
    const first = formRecover.querySelector('input');
    if (first) first.focus();
    updateWelcomeText(null, true);
  }

  const headerTitle = document.querySelector('.brand h1');
  const welcomeText = document.querySelector('.Bienvenido p');

  function updateWelcomeText(isLogin, isRecover=false) {
    if (isRecover) {
      headerTitle.textContent = 'Recuperar contraseña';
      welcomeText.textContent = 'Ingresa tus datos para restablecer la contraseña';
    } else if (isLogin) {
      headerTitle.textContent = 'Inicio de sesión';
      welcomeText.textContent = 'Inicia sesión para continuar';
    } else {
      headerTitle.textContent = 'Crea tu cuenta!';
      welcomeText.textContent = 'Regístrate para crear una cuenta';
    }
  }

  if (linkShowRegister) linkShowRegister.addEventListener('click', function(e){ e.preventDefault(); showRegister(); });
  if (linkShowLogin) linkShowLogin.addEventListener('click', function(e){ e.preventDefault(); showLogin(); });
  if (linkShowLogin2) linkShowLogin2.addEventListener('click', function(e){ e.preventDefault(); showLogin(); });

  btnForgot.addEventListener('click', function(e){ e.preventDefault(); showRecover(); });

  updateWelcomeText(!formLogin.classList.contains('hidden'));

  // Envío login
  formLogin.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(formLogin);
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    if (!email || !password) {
      feedbackMsg.textContent = 'Completa todos los campos.';
      return;
    }
    feedbackMsg.textContent = 'Procesando...';
    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        feedbackMsg.style.color = 'green';
        feedbackMsg.textContent = '¡Bienvenido!';
        setTimeout(()=>location.href='../../inicio/html/html_inicio.html',1200);
      } else {
        feedbackMsg.style.color = '#c00';
        feedbackMsg.textContent = json.error || 'Error al iniciar sesión.';
      }
    } catch {
      feedbackMsg.style.color = '#c00';
      feedbackMsg.textContent = 'Error de comunicación.';
    }
    formLogin.reset();
  });

  // Envío registro
  formRegister.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(formRegister);
    const fullname = formData.get('fullname')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    if (!fullname || !email || !password) {
      feedbackMsg.textContent = 'Completa todos los campos.';
      return;
    }
    feedbackMsg.textContent = 'Procesando...';
    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ register:true, fullname, email, password })
      });
      const json = await res.json();
      if (json.success) {
        feedbackMsg.style.color = 'green';
        feedbackMsg.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
        setTimeout(()=>showLogin(),1500);
      } else {
        feedbackMsg.style.color = '#c00';
        feedbackMsg.textContent = json.error || 'Error al registrar.';
      }
    } catch {
      feedbackMsg.style.color = '#c00';
      feedbackMsg.textContent = 'Error de comunicación.';
    }
    formRegister.reset();
  });

  // Envío recuperación (MVP: solo si nombre+correo existen, muestra la contraseña en alerta)
  formRecover.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(formRecover);
    const fullname = formData.get('fullname')?.trim();
    const email = formData.get('email')?.trim();
    if (!fullname || !email) {
      feedbackMsg.textContent = 'Completa todos los campos.';
      return;
    }
    feedbackMsg.textContent = 'Buscando...';
    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ recover:true, fullname, email })
      });
      const json = await res.json();
      if (json.success && json.password) {
        feedbackMsg.style.color = 'green';
        feedbackMsg.textContent = 'Contraseña recuperada (solo para demo):';
        setTimeout(()=>alert('Tu contraseña: '+json.password),900);
        showLogin();
      } else {
        feedbackMsg.style.color = '#c00';
        feedbackMsg.textContent = json.error || 'No se pudo recuperar la contraseña.';
      }
    } catch {
      feedbackMsg.style.color = '#c00';
      feedbackMsg.textContent = 'Error de comunicación.';
    }
    formRecover.reset();
  });
});