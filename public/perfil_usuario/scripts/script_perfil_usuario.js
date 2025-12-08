document.addEventListener('DOMContentLoaded', function () {
  // Tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
        const tgt = document.getElementById(x.dataset.target);
        if (tgt) { tgt.classList.add('hidden'); tgt.setAttribute('aria-hidden', 'true'); }
      });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      const target = document.getElementById(t.dataset.target);
      if (target) {
        target.classList.remove('hidden');
        target.setAttribute('aria-hidden', 'false');
      }
    });
  });

  const changeBtn = document.getElementById('changePhotoBtn');
  const fileInput = document.getElementById('photoInput');
  const avatar = document.getElementById('avatar');
  const feedback = document.getElementById('profileFeedback');

  // Detectar usuario actual (puedes usar tu sesión real aquí)
  let userId = null;
  // Para demo: podrías obtener userId de sessionStorage o variable global, aquí asume 1
  userId = sessionStorage.getItem('usuario_id') || 1;

  // Cargar datos al inicializar
  fetch(`/api/perfil_usuario.php?user_id=${userId}`)
    .then(r => r.json())
    .then(d => {
      if (!d.success) {
        feedback.textContent = d.error || 'No se pudo cargar el perfil';
        feedback.style.color = '#c00';
        return;
      }
      // General
      let g = d.user;
      document.querySelector('input[name="username"]').value = g.username || "";
      document.querySelector('input[name="email"]').value = g.email || "";
      document.querySelector('input[name="phone"]').value = g.phone || "";
      // Personales
      document.querySelector('input[name="fullname"]').value = g.fullname || "";
      document.querySelector('input[name="address"]').value = g.address || "";
      document.querySelector('input[name="birth_date"]').value = g.birth_date || "";
      // Avatar
      if (g.avatar_path) {
        avatar.style.backgroundImage = `url('${g.avatar_path}')`;
      }
    }).catch(err => {
      feedback.textContent = "Error de comunicación.";
      feedback.style.color = "#c00";
    });

  // Cambiar fotografía
  changeBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // preview local
    const url = URL.createObjectURL(f);
    avatar.style.backgroundImage = `url('${url}')`;
    // Subir al backend
    const data = new FormData();
    data.append('photo', f);
    data.append('user_id', userId);
    fetch('/api/perfil_usuario.php', {
      method: 'POST',
      body: data
    })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.avatar_path) {
          avatar.style.backgroundImage = `url('${json.avatar_path}')`;
          feedback.textContent = "Fotografía actualizada";
          feedback.style.color = "green";
        } else {
          feedback.textContent = json.error || "No se pudo actualizar foto";
          feedback.style.color = "#c00";
        }
      })
      .catch(() => {
        feedback.textContent = "Error de comunicación";
        feedback.style.color = "#c00";
      });
  });

  // Guardar cambios generales
  document.getElementById('profileFormGeneral').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      user_id: userId,
      username: form.username.value,
      email: form.email.value,
      phone: form.phone.value,
      action: 'update_general'
    };
    fetch('/api/perfil_usuario.php', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          feedback.textContent = "Cambios guardados";
          feedback.style.color = "green";
        } else {
          feedback.textContent = json.error || "No se pudo guardar cambios";
          feedback.style.color = "#c00";
        }
      });
  });

  // Guardar cambios personales
  document.getElementById('profileFormPersonal').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      user_id: userId,
      fullname: form.fullname.value,
      address: form.address.value,
      birth_date: form.birth_date.value,
      action: 'update_personal'
    };
    fetch('/api/perfil_usuario.php', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          feedback.textContent = "Cambios guardados";
          feedback.style.color = "green";
        } else {
          feedback.textContent = json.error || "No se pudo guardar cambios";
          feedback.style.color = "#c00";
        }
      });
  });
});