// Загрузка сохранённого цвета
const savedColor = localStorage.getItem('bgColor');
if (savedColor) {
  document.body.style.backgroundColor = savedColor;
}

// События на выбор цвета
document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const color = link.getAttribute('data-color');
    document.body.style.backgroundColor = color;
    localStorage.setItem('bgColor', color);
  });
});

let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = localStorage.getItem("currentUser");

if (currentUser) {
  const u = users.find(u => u.name === currentUser);
  if (u) {
    u.isOnline = true;
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("login-screen").style.display = "none";
    document.querySelector(".header-username").textContent = u.name;
    addDeleteAccountButton();
    if (u.name === "ivan2012") showAdminPanel();
  }
}

function login() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;

  if (!name || !pass) return alert("Täytä molemmat kentät!");

  const isAdmin = (name === "ivan2012" && pass === "titanivan2012");
  let user = users.find(u => u.name === name);

  if (user) {
    if (!isAdmin && user.password !== pass) {
      return alert("Väärä salasana!");
    }
  } else {
    user = { name, password: pass, isOnline: true };
    users.push(user);
  }

  user.isOnline = true;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", name);
  document.getElementById("login-screen").style.display = "none";
  document.querySelector(".header-username").textContent = name;
  addDeleteAccountButton();
  if (isAdmin) showAdminPanel();
}

function logoutUser(name) {
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.name === name);
  if (user) {
    user.isOnline = false;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

window.addEventListener("beforeunload", () => {
  const name = localStorage.getItem("currentUser");
  logoutUser(name);
});

function showAdminPanel() {
  const adminBtn = document.createElement("button");
  adminBtn.className = "admin-button";
  adminBtn.textContent = "!";

  adminBtn.onclick = () => {
    document.body.appendChild(createAdminScreen());
  };

  document.body.appendChild(adminBtn);
}

function createAdminScreen() {
  const overlay = document.createElement("div");
  overlay.className = "admin-overlay";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.className = "close-admin";
  closeBtn.onclick = () => overlay.remove();
  overlay.appendChild(closeBtn);

  const list = document.createElement("div");
  list.className = "admin-user-list";
  list.innerHTML = "<h2>Rekisteröityneet käyttäjät</h2>";

  users.forEach((u, index) => {
    const row = document.createElement("div");
    row.className = "admin-user-row";

    const status = u.isOnline ? "online" : "offline";
    const color = u.isOnline ? "green" : "red";

    row.innerHTML = `
      <div class="user-info">
        <div><strong>Nimi:</strong> ${u.name}</div>
        <div><strong>Salasana:</strong> ${u.password}</div>
      </div>
      <div class="user-status" style="color: ${color}; font-weight: bold;">${status}</div>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-user-btn";
    delBtn.textContent = "✕";
    delBtn.onclick = () => {
      if (confirm(`Haluatko varmasti poistaa käyttäjän "${u.name}"?`)) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        if (u.name === localStorage.getItem("currentUser")) {
          localStorage.removeItem("currentUser");
          location.reload();
        } else {
          overlay.remove();
          document.body.appendChild(createAdminScreen());
        }
      }
    };

    row.appendChild(delBtn);
    list.appendChild(row);
  });

  overlay.appendChild(list);
  return overlay;
}

function addDeleteAccountButton() {
  const btn = document.createElement("button");
  btn.className = "user-delete-btn";
  btn.textContent = "!";

  btn.onclick = () => {
    const confirmBox = document.createElement("div");
    confirmBox.className = "confirm-delete-box";
    confirmBox.innerHTML = `
      <p>Haluatko poistua tilistä?</p>
      <div class="confirm-buttons">
        <button onclick="confirmDeleteAccount()">Kyllä</button>
        <button onclick="this.parentElement.parentElement.remove()">Ei</button>
      </div>
    `;
    document.body.appendChild(confirmBox);
  };

  document.body.appendChild(btn);
}

function confirmDeleteAccount() {
  const name = localStorage.getItem("currentUser");
  logoutUser(name);
  alert("Tiliä ei voi poistaa — vain ylläpitäjä voi tehdä sen.");
  document.querySelector(".confirm-delete-box")?.remove();
}
