// scripts.js - genera la rejilla de horario con horas y selección por arrastre (ratón y táctil)

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('scheduleGrid');
  const showMoreBtn = document.getElementById('showMore');
  const DAYS = 7;
  let isMouseDown = false;
  let dragMode = null; // "select" or "deselect"
  const touchedCells = new Set();

  // Horario: empieza a las 08:00, intervalo 30 minutos
  let startHour = 8;
  const intervalMinutes = 30;
  let rowsCount = 7; // filas iniciales
  createRows(rowsCount);

  // Añadir más filas (sigue la secuencia temporal)
  showMoreBtn.addEventListener('click', function () {
    createRows(2);
    showMoreBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => window.scrollBy({ top: 180, behavior: 'smooth' }), 120);
  });

  // Toggle selección en click simple
  grid.addEventListener('click', function (e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    toggleCell(cell);
  });

  // Soporte arrastre con ratón
  grid.addEventListener('mousedown', function (e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    isMouseDown = true;
    dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
    applyDragToCell(cell);
    e.preventDefault();
  });
  document.addEventListener('mouseup', function () { isMouseDown = false; dragMode = null; });

  grid.addEventListener('mouseover', function (e) {
    if (!isMouseDown || !dragMode) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;
    applyDragToCell(cell);
  });

  // Soporte táctil (touch)
  grid.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el && el.closest('.cell');
    if (!cell) return;
    // determinar modo
    dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
    touchedCells.clear();
    applyDragToCell(cell);
    e.preventDefault();
  }, { passive: false });

  grid.addEventListener('touchmove', function (e) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el && el.closest('.cell');
    if (!cell) return;
    applyDragToCell(cell);
    e.preventDefault();
  }, { passive: false });

  grid.addEventListener('touchend', function () {
    dragMode = null;
    touchedCells.clear();
  });

  // Días: selección visual
  document.querySelectorAll('.day').forEach((btn, idx) => {
    if (idx === 0) btn.classList.add('active'); // Lunes activo por defecto
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Hamburger (solo visual)
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.topbar').classList.toggle('open');
  });

  // --- funciones auxiliares ---

  // Crea n filas consecutivas con etiquetas de tiempo
  function createRows(n) {
    // calcular la hora de inicio en base al número de filas ya existentes
    const existingSlots = grid.querySelectorAll('.row').length;
    let slotIndex = existingSlots;
    for (let r = 0; r < n; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let c = 0; c < DAYS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const timeText = slotIndexToTime(slotIndex);
        const timeEl = document.createElement('div');
        timeEl.className = 'time';
        timeEl.textContent = timeText;
        const labelEl = document.createElement('div');
        labelEl.className = 'label';
        labelEl.textContent = ''; // espacio para el servicio si se necesita
        cell.appendChild(timeEl);
        cell.appendChild(labelEl);
        row.appendChild(cell);
      }
      grid.appendChild(row);
      slotIndex++;
    }
  }

  // convierte índice de slot a hora (ej: 0 -> 08:00, 1 -> 08:30, 2 -> 09:00, ...)
  function slotIndexToTime(index) {
    const totalMinutes = startHour * 60 + index * intervalMinutes;
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    const hhStr = String(hh).padStart(2, '0');
    const mmStr = String(mm).padStart(2, '0');
    return `${hhStr}:${mmStr}`;
  }

  // Alterna una celda (click)
  function toggleCell(cell) {
    cell.classList.toggle('selected');
  }

  // Aplicar arrastre: seleccionar o deseleccionar según dragMode
  function applyDragToCell(cell) {
    // evitar repetir muchas veces en touchmove
    const id = cell.__cellId || (cell.__cellId = Math.random().toString(36).slice(2));
    if (touchedCells.has(id)) return;
    touchedCells.add(id);

    if (dragMode === 'select') {
      cell.classList.add('selected');
    } else if (dragMode === 'deselect') {
      cell.classList.remove('selected');
    }
  }
});