// script_agendados.js - genera filas y controla interacciones (limpio y con un solo DOMContentLoaded)

document.addEventListener('DOMContentLoaded', function () {
  const servicesList = document.getElementById('servicesList');
  const showMoreBtn = document.getElementById('showMore');
  const hamburger = document.querySelector('button.hamburger');

  // initial rows to match image (approx 8)
  const INITIAL_ROWS = 8;
  createRows(INITIAL_ROWS);

  // Mostrar más agrega 4 filas por click
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      createRows(4);
      showMoreBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        window.scrollBy({ top: 240, behavior: 'smooth' });
      }, 100);
    });
  }

  // Delegate click for cancel buttons
  if (servicesList) {
    servicesList.addEventListener('click', function (e) {
      const btn = e.target.closest('.pill.cancel');
      if (!btn) return;
      const row = btn.closest('.service-row');
      if (!row) return;
      row.classList.toggle('canceled');
      btn.textContent = row.classList.contains('canceled') ? 'Restaurado' : 'Cancelar';
    });
  }

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Utility: create n rows
  function createRows(n) {
    for (let i = 0; i < n; i++) {
      const row = document.createElement('div');
      row.className = 'service-row';

      const pCliente = document.createElement('div');
      pCliente.className = 'pill';
      pCliente.textContent = 'Nombre del cliente';

      const pServicio = document.createElement('div');
      pServicio.className = 'pill';
      pServicio.textContent = 'Nombre del servicio';

      const pCosto = document.createElement('div');
      pCosto.className = 'pill small';
      pCosto.textContent = 'Costo';

      const pHorario = document.createElement('div');
      pHorario.className = 'pill action';
      pHorario.textContent = 'Horario';

      const pCancel = document.createElement('div');
      pCancel.className = 'pill cancel';
      pCancel.textContent = 'Cancelar';

      row.appendChild(pCliente);
      row.appendChild(pServicio);
      row.appendChild(pCosto);
      row.appendChild(pHorario);
      row.appendChild(pCancel);

      servicesList.appendChild(row);
    }
  }
});