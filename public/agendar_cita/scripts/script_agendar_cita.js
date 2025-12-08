document.addEventListener('DOMContentLoaded', () => {
  const serviceSearch = document.getElementById('service-search');
  const serviceImg = document.getElementById('service-img');
  const overlay = document.getElementById('overlay-text');
  const datesList = document.querySelector('#dates ul');
  const hoursList = document.querySelector('#hours ul');
  const bookBtn = document.getElementById('book-btn');
  const confirmMsg = document.getElementById('confirmMsg');
  const notesInput = document.getElementById('notes');
  const dropdown = document.getElementById('services-dropdown');
  let services = [];
  let selectedServiceId = null;
  let selectedServiceTitle = '';
  let selectedImg = '';
  let selectedDate = '';
  let selectedHour = '';

  // 1. Cargar servicios disponibles
  fetch('/api/agendar_cita.php')
    .then(r => r.json())
    .then(json => {
      services = json.data || [];
    });

  // Mostrar dropdown y filtrar servicios mientras escribe
  serviceSearch.addEventListener('input', function(e){
    const val = e.target.value.toLowerCase().trim();
    dropdown.innerHTML = '';
    let filtered = services.filter(s=>s.name.toLowerCase().includes(val));
    if(filtered.length === 0 && val.length){
      dropdown.innerHTML = '<div class="option">Sin coincidencias</div>';
      selectedServiceId = null;
      overlay.textContent = "Servicio: " + serviceSearch.value;
      serviceImg.src = "https://picsum.photos/seed/blood/800/500";
    } else {
      filtered.forEach(serv => {
        let div = document.createElement('div');
        div.className = 'option';
        div.textContent = serv.name;
        div.onclick = () => {
          serviceSearch.value = serv.name;
          selectedServiceId = serv.id;
          selectedServiceTitle = serv.name;
          selectedImg = serv.thumbnail_path || `https://picsum.photos/seed/${serv.name}/900/600`;
          serviceImg.src = selectedImg;
          overlay.textContent = serv.name;
          dropdown.classList.remove('show');

          // Al seleccionar un servicio, carga fechas disponibles dinámicamente
          fetch(`/api/agendar_cita.php?action=dates&service_id=${serv.id}`)
            .then(r => r.json())
            .then(json => {
              datesList.innerHTML = '';
              (json.data||[]).forEach(f => {
                const li = document.createElement('li');
                li.textContent = f.label;
                li.dataset.value = f.value;
                datesList.appendChild(li);
              });
              selectedDate = '';
              document.querySelector('#dates summary').textContent = "Fechas disponibles ▾";
              hoursList.innerHTML = '';
              document.querySelector('#hours summary').textContent = "Horarios disponibles ▾";
              selectedHour = '';
            });
        };
        dropdown.appendChild(div);
      });
    }
    dropdown.classList.toggle('show', filtered.length > 0 || val.length > 0);
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', function(e){
    if(!dropdown.contains(e.target) && e.target !== serviceSearch){
      dropdown.classList.remove('show');
    }
  });

  // Fechas disponibles (dinámico)
  datesList.addEventListener('click', function(ev) {
    if(ev.target.tagName === 'LI'){
      selectedDate = ev.target.dataset.value;
      datesList.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      ev.target.classList.add('active');
      document.querySelector('#dates summary').textContent = ev.target.textContent + " ▾";
      
      // Al seleccionar una fecha, consulta horarios disponibles con fetch
      if (selectedServiceId && selectedDate) {
        fetch(`/api/agendar_cita.php?action=hours&service_id=${selectedServiceId}&date=${selectedDate}`)
          .then(r => r.json())
          .then(json => {
            hoursList.innerHTML = '';
            (json.data||[]).forEach(h => {
              const li = document.createElement('li');
              li.textContent = h;
              li.dataset.value = h;
              hoursList.appendChild(li);
            });
            selectedHour = '';
            document.querySelector('#hours summary').textContent = "Horarios disponibles ▾";
          });
      }
    }
  });

  hoursList.addEventListener('click', function(ev){
    if(ev.target.tagName === 'LI'){
      selectedHour = ev.target.dataset.value;
      hoursList.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      ev.target.classList.add('active');
      document.querySelector('#hours summary').textContent = ev.target.textContent + " ▾";
    }
  });

  // Book/Agendar cita
  bookBtn.addEventListener('click', async () => {
    if(!selectedServiceId){confirmMsg.textContent="Elija un servicio.";confirmMsg.style.display='block'; return;}
    if(!selectedDate){confirmMsg.textContent="Elija una fecha.";confirmMsg.style.display='block'; return;}
    if(!selectedHour){confirmMsg.textContent="Elija un horario.";confirmMsg.style.display='block'; return;}
    let scheduledAt = `${selectedDate} ${selectedHour}:00`;
    let notes = notesInput.value.trim();

    confirmMsg.textContent = "Guardando cita...";
    confirmMsg.style.display="block";
    try {
      let res = await fetch('/api/agendar_cita.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          service_id: selectedServiceId,
          scheduled_at: scheduledAt,
          notes
        })
      });
      let json = await res.json();
      if(res.ok && json.success){
        confirmMsg.textContent = "¡Cita agendada exitosamente!";
        bookBtn.disabled = true;
        setTimeout(() => { confirmMsg.style.display='none'; bookBtn.disabled = false; }, 1800);
      }else{
        confirmMsg.textContent = "Ocurrió un error: " + (json.error||"Intente de nuevo.");
      }
    }catch(err){
      confirmMsg.textContent = "Error de comunicación con el servidor.";
    }
  });

  // Detalles/dropdown UI helpers
  document.querySelectorAll('.detail-control ul').forEach(ul => {
    ul.addEventListener('click', ev => {
      if(ev.target.tagName === 'LI'){
        let parent = ul.closest('.detail-control');
        let summary = parent.querySelector('summary');
        summary.textContent = ev.target.textContent + " ▾";
        parent.removeAttribute('open');
      }
    });
  });
});