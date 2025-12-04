// scripts.js - genera filas de "Servicios" y controla "Mostrar más" y cancelar fila

document.addEventListener('DOMContentLoaded', function () {
  const servicesList = document.getElementById('servicesList');
  const showMoreBtn = document.getElementById('showMore');

  // initial rows to match image (approx 8)
  const INITIAL_ROWS = 8;
  createRows(INITIAL_ROWS);

  // Mostrar más agrega 4 filas por click
  showMoreBtn.addEventListener('click', function () {
    createRows(4);
    showMoreBtn.setAttribute('aria-expanded', 'true');
    // scroll to show new rows
    setTimeout(() => {
      window.scrollBy({ top: 240, behavior: 'smooth' });
    }, 100);
  });

  // Delegate click for cancel buttons
  servicesList.addEventListener('click', function (e) {
    const btn = e.target.closest('.pill.cancel, .pill.cancel > button');
    if (!btn) return;
    // find row container
    const row = btn.closest('.service-row');
    if (!row) return;
    // toggle canceled state
    row.classList.toggle('canceled');
    // optional: change text of cancel to "Restaurar"
    const cancelPill = row.querySelector('.pill.cancel');
    if (row.classList.contains('canceled')) {
      cancelPill.textContent = 'Restaurado';
      setTimeout(() => { cancelPill.textContent = 'Restaurado'; }, 10);
    } else {
      cancelPill.textContent = 'Cancelar';
    }
  });

  // Utility: create n rows
  function createRows(n) {
    for (let i = 0; i < n; i++) {
      const row = document.createElement('div');
      row.className = 'service-row';

      // Pill: Nombre del cliente
      const pCliente = document.createElement('div');
      pCliente.className = 'pill';
      pCliente.textContent = 'Nombre del cliente';

      // Pill: Nombre del servicio
      const pServicio = document.createElement('div');
      pServicio.className = 'pill';
      pServicio.textContent = 'Nombre del servicio';

      // Pill: Costo (small)
      const pCosto = document.createElement('div');
      pCosto.className = 'pill small';
      pCosto.textContent = 'Costo';

      // Pill: Horario (action)
      const pHorario = document.createElement('div');
      pHorario.className = 'pill action';
      pHorario.textContent = 'Horario';

      // Pill: Cancel (pink)
      const pCancel = document.createElement('div');
      pCancel.className = 'pill cancel';
      pCancel.textContent = 'Cancelar';
      // Make cancel clickable (works via event delegation)

      // Append in order
      row.appendChild(pCliente);
      row.appendChild(pServicio);
      row.appendChild(pCosto);
      row.appendChild(pHorario);
      row.appendChild(pCancel);

      servicesList.appendChild(row);
    }
  }
});