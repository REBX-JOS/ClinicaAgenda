document.addEventListener('DOMContentLoaded', function () {
  // Abrir/cerrar offcanvas
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
  // Control de sesión y visibilidad de links por login/rol
  fetch("/api/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "same-origin",
    body: JSON.stringify({session:true})
  }).then(r=>r.json())
    .then(json=>{
      const user = json.success && json.user ? json.user : null;
      document.querySelectorAll('.nav-auth-required').forEach(el => el.style.display = user ? "" : "none");
      document.querySelectorAll('.nav-guest-only').forEach(el => el.style.display = user ? "none" : "");
      document.querySelectorAll('.nav-admin-only').forEach(el => el.style.display=(user && user.role>=3)?"":"none");
    });
});

// Cerrar sesión global (usado en botón)
function logoutSession() {
  fetch("/api/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "same-origin",
    body: JSON.stringify({logout:true})
  }).then(()=>window.location.href="/logIn/html/html_logIn.html");
}