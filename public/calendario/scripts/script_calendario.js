// script_calendario.js - genera la rejilla, añade horas y permite selección por arrastre.
// Implementa también toggle del hamburger (clase .open)

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('scheduleGrid');
  const showMoreBtn = document.getElementById('showMore');
  const hamburger = document.querySelector('button.hamburger');

  // schedule config: start 08:00, 30min slots
  const startHour = 8; // horario inicial (08:00)
  const endHour = 23; // horario final (23:00)
  const intervalMinutes = 30;
  const DAYS = 7;
  let rowsCreated = 0;

  // create initial rows (to resemble image)
  createRows(6);

  // Show more
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      createRows(26); // crea 26 filas, despliega hasta el final del día
      showMoreBtn.style.display = 'none'; // Corregir el botón no debe eliminar 
      showMoreBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => window.scrollBy({ top: 200, behavior: 'smooth' }), 120);
    });
  }

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Selection by click and by drag (mouse + touch)
  let isMouseDown = false;
  let dragMode = null;
  const touched = new Set();

  grid.addEventListener('mousedown', function (e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    isMouseDown = true;
    dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
    applyDrag(cell);
    e.preventDefault();
  });
  document.addEventListener('mouseup', () => { isMouseDown = false; dragMode = null; touched.clear(); });

  grid.addEventListener('mouseover', function (e) {
    if (!isMouseDown) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;
    applyDrag(cell);
  });

  grid.addEventListener('click', function (e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    cell.classList.toggle('selected');
  });

  // touch support
  grid.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el && el.closest('.cell');
    if (!cell) return;
    dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
    touched.clear();
    applyDrag(cell);
    e.preventDefault();
  }, { passive: false });

  grid.addEventListener('touchmove', function (e) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el && el.closest('.cell');
    if (!cell) return;
    applyDrag(cell);
    e.preventDefault();
  }, { passive: false });

  grid.addEventListener('touchend', function () {
    dragMode = null;
    touched.clear();
  });

  // day buttons simple behavior
  document.querySelectorAll('.day').forEach((btn, idx) => {
    if (idx === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // helpers

  function applyDrag(cell) {
    const id = cell.__id || (cell.__id = Math.random().toString(36).slice(2));
    if (touched.has(id)) return;
    touched.add(id);
    if (dragMode === 'select') cell.classList.add('selected');
    else if (dragMode === 'deselect') cell.classList.remove('selected');
  }

  function createRows(n) {
    for (let r = 0; r < n; r++) {
      const totalMinutes = startHour * 60 + rowsCreated * intervalMinutes;
      const endLimit = endHour * 60 + 30; // termina en 23:30 (si interval es 30)
      if (totalMinutes > endLimit) break;

      const row = document.createElement('div');
      row.className = 'row';
      for (let c = 0; c < DAYS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const timeText = slotIndexToTime(rowsCreated);

        cell.dataset.time = timeText;    // Ej: "19:00"
        cell.dataset.day = c;            // Ej: 0 (lunes), 1 (martes), etc.
        cell.dataset.row = rowsCreated;  // Índice de fila/hora

        const timeEl = document.createElement('div');
        timeEl.className = 'time';
        timeEl.textContent = timeText;

        const labelEl = document.createElement('div');
        labelEl.className = 'label';
        labelEl.textContent = '';

        cell.appendChild(timeEl);
        cell.appendChild(labelEl);
        row.appendChild(cell);
      }
      grid.appendChild(row);
      rowsCreated++;
    }
  }

  function slotIndexToTime(index) {
    const totalMinutes = startHour * 60 + index * intervalMinutes;
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    const hhStr = String(hh).padStart(2, '0');
    const mmStr = String(mm).padStart(2, '0');
    return `${hhStr}:${mmStr}`;
  }


  // Muestra la tarjeta de cita/servicio en el horario seleccionado



  grid.addEventListener('click', function(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;

  // Obtén hora/día de la celda
  const hora = cell.dataset.time;
  const dia = cell.dataset.day;

  // Haz fetch para pedir la cita exacta en ese horario a tu endpoint, por ej:
  fetch(`/api/calendario.php?hora=${hora}&dia=${dia}`)
    .then(r => r.json())
    .then(data => {
      mostrarCardCita(data);
    })
    .catch(() => mostrarCardCita(null));
  });
  
  function mostrarCardCita(data) {
  const modal = document.getElementById('citaModal');
  const card = document.getElementById('citaCard');
  if (!modal || !card) return;

  modal.style.display = "flex";
  if (data && data.servicio) {
    card.innerHTML = `
      <button type="button" class="close-btn" aria-label="Cerrar">&times;</button>
      <div class="card-content">
        <h3>${data.servicio}</h3>
        <p><b>Cliente:</b> ${data.cliente}</p>
        <p><b>Horario:</b> ${data.hora}</p>
        <p><b>Detalles:</b> ${data.descripcion || "-"}</p>
      </div>
    `;
  } else {
      card.innerHTML = `
        <button type="button" class="close-btn" aria-label="Cerrar">&times;</button>
        <div class="card-content no-cita">
          <p>No hay cita agendada en este horario.</p>
        </div>
      `;
    }
  }

  // Cerrar al hacer click en la X
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('citaModal');
    if (!modal || modal.style.display !== 'flex') return;

    // Click en la X
    if (e.target.classList.contains('close-btn')) {
      modal.style.display = 'none';
    }

    // Clic fuera del card
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});