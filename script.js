// Загрузка сохранённого цвета
const savedColor = localStorage.getItem('bgColor');
if (savedColor) {
  document.body.style.backgroundColor = savedColor;
}

// Навешиваем события на элементы
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
    document.getElementById("login-screen").style.display = "none";
    document.querySelector(".header-username").textContent = u.name;
    addDeleteAccountButton();
    showUserStatus(u);
    if (u.name === "ivan2012") showAdminPanel();
  }
}

function login() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;

  if (!name || !pass) return alert("Täytä molemmat kentät!");

  // ✅ Спецпроверка для админа
  const isAdmin = (name === "ivan2012" && pass === "titanivan2012");
  let user = users.find(u => u.name === name);

  if (user) {
    if (!isAdmin && user.password !== pass) {
      return alert("Väärä salasana!");
    }
  } else {
    user = { name, password: pass };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  localStorage.setItem("currentUser", name);
  document.getElementById("login-screen").style.display = "none";
  document.querySelector(".header-username").textContent = name;
  addDeleteAccountButton();
  showUserStatus(user);
  if (isAdmin) showAdminPanel();
}

function showUserStatus(user) {
  const userStatus = document.createElement("span");
  userStatus.textContent = " - ";
  if (navigator.onLine) {
    userStatus.textContent += "online";
    userStatus.style.color = "green";
  } else {
    userStatus.textContent += "offline";
    userStatus.style.color = "red";
  }
  document.querySelector(".header-username").appendChild(userStatus);
}

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
    row.innerHTML = `
      <div class="user-info">
        <div><strong>Nimi:</strong> ${u.name}</div>
        <div><strong>Salasana:</strong> ${u.password}</div>
      </div>
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
  btn.textContent = "Logout";

  btn.onclick = () => {
    localStorage.removeItem("currentUser");
    document.getElementById("login-screen").style.display = "block";
    document.querySelector(".header-username").textContent = "";
    document.querySelector(".user-delete-btn").remove();
    showLoginForm();
  };

  document.body.appendChild(btn);
}

function showLoginForm() {
  const loginForm = document.getElementById("login-screen");
  if (loginForm) loginForm.style.display = "block";
}

function confirmDeleteAccount() {
  alert("Tiliä ei voi poistaa — vain ylläpitäjä voi tehdä sen.");
  document.querySelector(".confirm-delete-box")?.remove();
}
