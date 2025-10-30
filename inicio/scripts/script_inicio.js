// script_inicio.js - comportamiento mínimo
document.addEventListener('DOMContentLoaded', function () {
  // si quieres que el botón de búsqueda haga algo
  const searchBtn = document.getElementById('searchBtn');
  const heroSearch = document.getElementById('heroSearch');
  if (searchBtn && heroSearch) {
    searchBtn.addEventListener('click', function (e) {
      const q = heroSearch.value.trim();
      if (!q) {
        heroSearch.focus();
        return;
      }
      // Ejemplo: redirigir a una búsqueda (ajusta la ruta)
      window.location.href = '/buscar.html?q=' + encodeURIComponent(q);
    });
  }

  // opcional: detectar al hacer scroll y animar la flecha (simple)
  const downAnchor = document.querySelector('.down-anchor');
  if (downAnchor) {
    downAnchor.addEventListener('click', function () {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});