// --- Sesión y protección de acceso - navbar igual que perfil/agendados ---
document.addEventListener('DOMContentLoaded', function () {
  fetch("/api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({session: true})
  })
  .then(r => r.json())
  .then(json => {
    const user = json.success && json.user ? json.user : null;
    if (!user) {
      window.location.href = "/logIn/html/html_logIn.html";
      return;
    }
    document.querySelectorAll('.nav-auth-required').forEach(el => el.style.display = "");
    document.querySelectorAll('.nav-guest-only').forEach(el => el.style.display = "none");
    document.querySelectorAll('.nav-admin-only').forEach(el => el.style.display = (user.role >= 3 ? "" : "none"));
    inicializarCalendario();
  });

  // --- Lógica principal de calendario ---
  function inicializarCalendario() {
    const grid = document.getElementById('scheduleGrid');
    const showMoreBtn = document.getElementById('showMore');
    // Config schedule
    const startHour = 8, endHour = 23, intervalMinutes = 30, DAYS = 7;
    let rowsCreated = 0;

    createRows(6);

    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', function () {
        createRows(26);
        showMoreBtn.style.display = 'none';
        showMoreBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => window.scrollBy({ top: 200, behavior: 'smooth' }), 120);
      });
    }

    // Day buttons highlight
    document.querySelectorAll('.day').forEach((btn, idx) => {
      if (idx === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Selección y drag:
    let isMouseDown = false, dragMode = null, touched = new Set();

    grid.addEventListener('mousedown', function (e) {
      const cell = e.target.closest('.calendar-cell');
      if (!cell) return;
      isMouseDown = true;
      dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
      applyDrag(cell);
      e.preventDefault();
    });
    document.addEventListener('mouseup', () => { isMouseDown = false; dragMode = null; touched.clear(); });

    grid.addEventListener('mouseover', function (e) {
      if (!isMouseDown) return;
      const cell = e.target.closest('.calendar-cell');
      if (!cell) return;
      applyDrag(cell);
    });

    grid.addEventListener('click', function (e) {
      const cell = e.target.closest('.calendar-cell');
      if (!cell) return;
      cell.classList.toggle('selected');
    });

    // touch support
    grid.addEventListener('touchstart', function (e) {
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const cell = el && el.closest('.calendar-cell');
      if (!cell) return;
      dragMode = !cell.classList.contains('selected') ? 'select' : 'deselect';
      touched.clear();
      applyDrag(cell);
      e.preventDefault();
    }, { passive: false });

    grid.addEventListener('touchmove', function (e) {
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const cell = el && el.closest('.calendar-cell');
      if (!cell) return;
      applyDrag(cell);
      e.preventDefault();
    }, { passive: false });

    grid.addEventListener('touchend', function () {
      dragMode = null;
      touched.clear();
    });

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
        const endLimit = endHour * 60 + 30;
        if (totalMinutes > endLimit) break;

        const row = document.createElement('div');
        row.className = 'calendar-row';
        for (let c = 0; c < DAYS; c++) {
          const cell = document.createElement('div');
          cell.className = 'calendar-cell';
          const timeText = slotIndexToTime(rowsCreated);
          cell.dataset.time = timeText;
          cell.dataset.day = c;
          cell.dataset.row = rowsCreated;
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

    // Modal card de cita por celda
    grid.addEventListener('click', function(e) {
      const cell = e.target.closest('.calendar-cell');
      if (!cell) return;
      const hora = cell.dataset.time;
      const dia = cell.dataset.day;
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

    // Cerrar el modal
    document.addEventListener('click', function(e) {
      const modal = document.getElementById('citaModal');
      if (!modal || modal.style.display !== 'flex') return;
      if (e.target.classList.contains('close-btn') || e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});