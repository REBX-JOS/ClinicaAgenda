// scripts.js - genera la rejilla de horario y controla interacciones

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('scheduleGrid');
  const showMoreBtn = document.getElementById('showMore');
  const DAYS = 7;

  // generar N filas iniciales
  const INITIAL_ROWS = 6;
  createRows(INITIAL_ROWS);

  // evento para añadir más filas
  showMoreBtn.addEventListener('click', function () {
    createRows(2); // añade 2 filas más cada click
    showMoreBtn.setAttribute('aria-expanded', 'true');
    // desplazar un poco hacia abajo para ver las nuevas filas
    setTimeout(() => {
      window.scrollBy({ top: 200, behavior: 'smooth' });
    }, 100);
  });

  // Toggle selección en celdas
  grid.addEventListener('click', function (e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    cell.classList.toggle('selected');
  });

  // días (fila superior) interacción simple
  document.querySelectorAll('.day').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // (opcional) podrías filtrar o resaltar las celdas correspondientes al día
    });
  });

  // hamburger simple (solo efecto visual)
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.topbar').classList.toggle('open');
    // podrías abrir un menú lateral aquí
  });

  // funcion que crea filas
  function createRows(n) {
    for (let r = 0; r < n; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let c = 0; c < DAYS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        // contenido opcional: hora o placeholder
        cell.textContent = ''; // dejar vacío para aspecto similar
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }
});