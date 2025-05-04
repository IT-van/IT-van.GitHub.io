// Загрузка сохранённого цвета
const savedColor = localStorage.getItem('bgColor');
if (savedColor) {
    document.body.style.backgroundColor = savedColor;
}
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const color = link.getAttribute('data-color');
        document.body.style.backgroundColor = color;
        localStorage.setItem('bgColor', color);
    });
});

// Загружаем пользователей и текущего
let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = localStorage.getItem("currentUser");

// Обновляем статус isOnline при загрузке, если пользователь залогинен
if (currentUser) {
    users = users.map(u => u.name === currentUser ? { ...u, isOnline: true } : u);
    localStorage.setItem("users", JSON.stringify(users));

    const u = users.find(u => u.name === currentUser);
    if (u) {
        document.getElementById("login-screen").style.display = "none";
        document.querySelector(".header-username").textContent = u.name;
        addLogoutButton(); // Изменено: кнопка теперь отвечает за выход
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
        user.isOnline = true;
    } else {
        user = { name, password: pass, isOnline: true };
        users.push(user);
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", name);

    document.getElementById("login-screen").style.display = "none";
    document.querySelector(".header-username").textContent = name;
    addLogoutButton(); // Изменено: кнопка теперь отвечает за выход
    if (isAdmin) showAdminPanel();
}

function logoutUser() { // Изменено: функция теперь просто выходит
    users = users.map(u => u.name === localStorage.getItem("currentUser") ? { ...u, isOnline: false } : u);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("currentUser");
    location.reload();
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

    const freshUsers = JSON.parse(localStorage.getItem("users") || "[]");

    freshUsers.forEach(u => { // Убрали index, так как он больше не используется для splice
        const row = document.createElement("div");
        row.className = "admin-user-row";

        const status = u.isOnline ? "online" : "offline";
        const color = u.isOnline ? "green" : "red";

        row.innerHTML = `
            <div class="user-info">
                <div><strong>Nimi:</strong> ${u.name}</div>
                <div><strong>Salasana:</strong> ${u.password}</div>
            </div>
            <div class="user-status" style="color: ${color}; font-weight: bold; margin-left: 10px;">${status}</div>
        `;

        const delBtn = document.createElement("button");
        delBtn.className = "delete-user-btn";
        delBtn.textContent = "✕";
        delBtn.onclick = () => {
            if (confirm(`Haluatko varmasti poistaa käyttäjän "${u.name}"?`)) {
                // Находим индекс пользователя для удаления
                const userIndex = freshUsers.findIndex(user => user.name === u.name);
                if (userIndex > -1) {
                    freshUsers.splice(userIndex, 1);
                    localStorage.setItem("users", JSON.stringify(freshUsers));
                    if (u.name === localStorage.getItem("currentUser")) {
                        localStorage.removeItem("currentUser");
                        location.reload();
                    } else {
                        overlay.remove();
                        document.body.appendChild(createAdminScreen());
                    }
                }
            }
        };

        row.appendChild(delBtn);
        list.appendChild(row);
    });

    overlay.appendChild(list);
    return overlay;
}

function addLogoutButton() { // Изменено: функция переименована и теперь вызывает выход
    const btn = document.createElement("button");
    btn.className = "user-delete-btn"; // Оставляем прежний класс для сохранения стиля
    btn.textContent = "!";
    btn.onclick = () => {
        const confirmBox = document.createElement("div");
        confirmBox.className = "confirm-delete-box";
        confirmBox.innerHTML = `
            <p>Haluatko poistua tilistä?</p>
            <div class="confirm-buttons">
                <button onclick="logoutUser()">Kyllä</button>
                <button onclick="this.parentElement.parentElement.remove()">Ei</button>
            </div>
        `;
        document.body.appendChild(confirmBox);
    };
    document.body.appendChild(btn);
}

// function confirmDeleteAccount() { // Удалено: эта функция больше не нужна
//     const name = localStorage.getItem("currentUser");
//     alert("Tiliä ei voi poistaa — vain ylläpitäjä voi tehdä sen.");
//     document.querySelector(".confirm-delete-box")?.remove();
// }