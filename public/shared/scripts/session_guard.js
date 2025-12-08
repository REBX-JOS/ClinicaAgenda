// USAR ESTE GUARD EN TODAS LAS PÁGINAS QUE REQUIERAN LOGIN
function checkSessionRedirect(redirectToLogin = true, cb = null) {
  fetch("/api/auth/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "same-origin",
    body: JSON.stringify({session:true})
  })
    .then(r => r.json())
    .then(json => {
      if (!json.success || !json.user) {
        if(redirectToLogin) window.location.href = "/logIn/html/html_logIn.html";
        if(cb) cb(null);
      } else {
        if(cb) cb(json.user);
      }
    });
}
// OPCIONAL: cerrar sesión
function logoutSession() {
  fetch("/api/auth/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "same-origin",
    body: JSON.stringify({logout:true})
  }).then(()=>window.location.href="/logIn/html/html_logIn.html");
}