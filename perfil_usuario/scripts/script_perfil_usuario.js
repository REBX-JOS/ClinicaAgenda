// Interactividad: pestañas y cambio de foto
document.addEventListener('DOMContentLoaded', function () {
  // Tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      // Desactivar todas
      tabs.forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
        const tgt = document.getElementById(x.dataset.target);
        if(tgt) { tgt.classList.add('hidden'); tgt.setAttribute('aria-hidden', 'true'); }
      });

      // Activar la seleccionada
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      const target = document.getElementById(t.dataset.target);
      if (target) {
        target.classList.remove('hidden');
        target.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Cambiar fotografía
  const changeBtn = document.getElementById('changePhotoBtn');
  const fileInput = document.getElementById('photoInput');
  const avatar = document.getElementById('avatar');

  changeBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // preview
    const url = URL.createObjectURL(f);
    avatar.style.backgroundImage = `url('${url}')`;
    // Liberar objectURL cuando la imagen cargue
    const img = new Image();
    img.src = url;
    img.onload = () => URL.revokeObjectURL(url);
  });

  // Guardar cambios (simulado)
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Aquí podrías enviar por fetch a tu API
      const data = new FormData(profileForm);
      // Mostrar feedback simple
      alert('Cambios guardados (simulado).');
      // console.log para debug
      // for (let [k,v] of data) console.log(k, v);
    });
  }
});