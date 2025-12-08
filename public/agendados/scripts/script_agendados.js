import('/shared/scripts/session_guard.js')
  .then(() => checkSessionRedirect(true))
  .catch(() => window.location.href="/logIn/html/html_logIn.html");

document.addEventListener('DOMContentLoaded', function () {
  const servicesList = document.getElementById('servicesList');
  const showMoreBtn = document.getElementById('showMore');
  let agendados = [];
  let shownRows = 0;

  // Carga inicial de datos reales 
  fetch('/api/agendados.php')
    .then(r => r.json())
    .then(json => {
      agendados = json.data || [];
      shownRows = 0;
      servicesList.innerHTML = ""; // limpia el contenido viejo
      renderRows(8);
    });

  // Mostrar más filas de datos reales
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      renderRows(4);
      showMoreBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        window.scrollBy({ top: 240, behavior: 'smooth' });
      }, 100);
    });
  }

  // Delegar click en botón cancelar (función completa)
  if (servicesList) {
    servicesList.addEventListener('click', function (e) {
      const btn = e.target.closest('.pill.cancel');
      if (!btn) return;

      const row = btn.closest('.service-row');
      if (!row) return;

      const citaId = row.dataset.id;
      if (!citaId) return;

      if (!window.confirm('¿Está seguro que desea cancelar? Esto eliminará el registro de la base de datos.')) return;

      // Llamada fetch para eliminar registro desde DB
      fetch('/api/agendados.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: citaId })
      })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          row.remove();
        } else {
          alert('No se pudo cancelar la cita.');
        }
      })
      .catch(() => alert('Error al intentar cancelar.'));
    });
  }

  // Renderizar filas reales
  function renderRows(n) {
    for (let i = 0; i < n && shownRows < agendados.length; i++, shownRows++) {
      const ag = agendados[shownRows];
      const row = document.createElement('div');
      row.className = ag.status === 'canceled' ? 'service-row canceled' : 'service-row';
      row.dataset.id = ag.id; // ASIGNA EL ID PARA CANCELAR

      const pCliente = document.createElement('div');
      pCliente.className = 'pill';
      pCliente.textContent = ag.cliente;

      const pServicio = document.createElement('div');
      pServicio.className = 'pill';
      pServicio.textContent = ag.servicio;

      const pCosto = document.createElement('div');
      pCosto.className = 'pill small';
      pCosto.textContent = ag.price !== undefined ? `$${ag.price}` : '';

      const pHorario = document.createElement('div');
      pHorario.className = 'pill action';
      pHorario.textContent = ag.horario;

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
  
  // Agregar a un archivo glbal.html para tener recursos comunes ahi precargados par hacer mas rapida la programacion y la pagina-->
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
});