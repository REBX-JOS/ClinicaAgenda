// Demo behavior: select a service and update image & overlay text.
// No frameworks needed. Replace images/logic with real endpoints.

const services = {
  "sangre": {
    title: "Toma de sangre",
    img: "https://picsum.photos/seed/sangre/900/600"
  },
  "ecografia": {
    title: "Ecografía",
    img: "https://picsum.photos/seed/ecografia/900/600"
  },
  "consulta": {
    title: "Consulta médica",
    img: "https://picsum.photos/seed/consulta/900/600"
  }
};

const serviceSearch = document.getElementById('service-search');
const serviceImg = document.getElementById('service-img');
const overlay = document.getElementById('overlay-text');

// When user types a service name, try to match a key and update the image.
serviceSearch.addEventListener('input', (e) => {
  const val = e.target.value.toLowerCase().trim();
  let foundKey = null;
  Object.keys(services).forEach(k => {
    if(services[k].title.toLowerCase().includes(val) || k.includes(val)){
      foundKey = k;
    }
  });

  if(foundKey){
    serviceImg.src = services[foundKey].img;
    overlay.textContent = services[foundKey].title;
  } else if(val === ''){
    serviceImg.src = "https://picsum.photos/seed/blood/800/500";
    overlay.textContent = "IMAGEN REFERENTE AL SERVICIO SELECCIONADO";
  } else {
    // partial/fallback
    overlay.textContent = "Servicio: " + e.target.value;
  }
});

// Handle clicks on dropdown list items (details > ul > li)
document.querySelectorAll('.detail-control ul li').forEach(li => {
  li.addEventListener('click', (ev) => {
    const parent = li.closest('.detail-control');
    const summary = parent.querySelector('summary');
    summary.textContent = li.textContent + " ▾";
    parent.removeAttribute('open');
  });
});

// Book button demo
document.getElementById('book-btn').addEventListener('click', () => {
  const service = serviceSearch.value || '(no seleccionado)';
  const date = (document.getElementById('dates').querySelector('summary') || {}).textContent || '(no)';
  const hour = (document.getElementById('hours').querySelector('summary') || {}).textContent || '(no)';
  alert(`Reservando:\nServicio: ${service}\nFecha: ${date}\nHorario: ${hour}`);
});



// Create Appointemnt for the selected service
async function createAppointment(serviceId, scheduledAt, notes='') {
  const res = await fetch('/api/appointments/create.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ service_id: serviceId, scheduled_at: scheduledAt, notes })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error creando cita');
  return json;
}


// Ejemplo: enviar login via fetch (reemplaza en script_logIn.js)
async function login(email, password) {
  const res = await fetch('/api/auth/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'same-origin' // o 'include' si cross-origin y habilitas CORS
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error login');
  return json;
}

async function loadServices() {
  const res = await fetch('/api/services/list.php', { credentials: 'same-origin' });
  const json = await res.json();
  if (res.ok && json.data) {
    // iterar e inyectar a DOM (ej. crear <li> o opciones)
    json.data.forEach(s => {
      // ejemplo: crear opción en lista o mostrar título e imagen
      console.log(s.name, s.price);
    });
  } else {
    console.error('Error cargando servicios', json);
  }
}

async function createAppointment(serviceId, scheduledAt, notes='') {
  const res = await fetch('/api/appointments/create.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ service_id: serviceId, scheduled_at: scheduledAt, notes })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error creando cita');
  return json;
}