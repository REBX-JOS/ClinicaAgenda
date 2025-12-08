// script_inicio.js - comportamiento mínimo
document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.getElementById('searchBtn');
  const heroSearch = document.getElementById('heroSearch');
  if (searchBtn && heroSearch) {
    searchBtn.addEventListener('click', function () {
      const q = heroSearch.value.trim();
      if (!q) { heroSearch.focus(); return; }
      // ejemplo de navegación de búsqueda
      window.location.href = '/buscar.html?q=' + encodeURIComponent(q);
    });
  }

  // Enlazar el botón hamburguesa para abrir el offcanvas de bootstrap
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const offcanvasEl = document.getElementById('menuOffcanvas');
      if (offcanvasEl) {
        const bsOff = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        bsOff.toggle();
      }
    });
  }

  // MENU OFFCANVAS: Esconder opciones protegidas si no hay sesión
  fetch("/api/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "same-origin",
    body: JSON.stringify({session:true})
  })
    .then(r => r.json())
    .then(json => {
      const user = json.success && json.user ? json.user : null;
      document.querySelectorAll('.nav-auth-required').forEach(el =>
        el.style.display = user ? "" : "none"
      );
      document.querySelectorAll('.nav-guest-only').forEach(el =>
        el.style.display = user ? "none" : ""
      );
      // Ejemplo avanzado: roles
      document.querySelectorAll('.nav-admin-only').forEach(el =>
        el.style.display = (user && user.role >=2) ? "" : "none"
      );
    });
});