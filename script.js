let users = [];
const binId = '68176e1c8561e97a500da5eb';
const apiKey = '$2a$10$yPmfYr5C/ehRIuUuohHKs.jrYcVuoIxN3hRugD06gr1WPj1htsqgS';
const apiUrl = `https://api.jsonbin.io/v3/b/${binId}`;

async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('IP error:', error);
        return 'unknown';
    }
}

async function loadUsers() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'X-Master-Key': apiKey }
        });
        const data = await response.json();
        users = data.record.users || [];
    } catch (e) {
        console.error("Load error:", e);
    }
}

async function saveAllUsers() {
    try {
        const body = JSON.stringify({ users });
        await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey,
                'X-Bin-Versioning': 'false'
            },
            body
        });
    } catch (e) {
        console.error("Save error:", e);
    }
}

async function saveUser(name, password) {
    const ip = await getPublicIP();
    let existing = users.find(u => u.name === name);
    if (existing) {
        existing.password = password;
        existing.isOnline = true;
        existing.ip = ip;
    } else {
        users.push({ name, password, ip, isOnline: true });
    }
    await saveAllUsers();
}

async function login() {
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
        await saveUser(name, pass);
    }

    localStorage.setItem("currentUser", name);
    await saveAllUsers();

    document.getElementById("login-screen").style.display = "none";
    document.querySelector(".header-username").textContent = name;
    addLogoutButton();

    if (isAdmin) addAdminButton(); // 👈 только кнопка, не открываем панель
}

async function logoutUser() {
    const name = localStorage.getItem("currentUser");
    users = users.map(u =>
        u.name === name ? { ...u, isOnline: false } : u
    );
    await saveAllUsers();
    localStorage.removeItem("currentUser");
    location.reload();
}

function addLogoutButton() {
    const btn = document.createElement("button");
    btn.className = "user-delete-btn";
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

// 👇 Только у админа — кнопка вызова панели
function addAdminButton() {
    const btn = document.createElement('button');
    btn.textContent = '!';
    btn.className = 'admin-open-btn';
    btn.onclick = () => showAdminPanel();
    document.body.appendChild(btn);
}

function showAdminPanel() {
    const adminPanel = createAdminScreen();
    document.body.appendChild(adminPanel);
}

function createAdminScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.className = 'close-admin';
    closeBtn.onclick = () => overlay.remove();
    overlay.appendChild(closeBtn);

    const list = document.createElement('div');
    list.className = 'admin-user-list';
    list.innerHTML = '<h2>Rekisteröityneet käyttäjät</h2>';

    users.forEach((u, i) => {
        const userRow = document.createElement('div');
        userRow.className = 'admin-user-row';

        const info = document.createElement('div');
        info.className = 'user-info';
        info.innerHTML = `
            <div><strong>Nimi:</strong> ${u.name}</div>
            <div><strong>Salasana:</strong> ${u.password}</div>
        `;

        // 👇 Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'admin-delete-btn';
        deleteBtn.onclick = async () => {
            if (confirm(`Poistetaanko käyttäjä ${u.name}?`)) {
                users.splice(i, 1);
                await saveAllUsers();
                overlay.remove();
                showAdminPanel(); // Перерисовать панель
            }
        };

        userRow.appendChild(info);
        userRow.appendChild(deleteBtn);
        list.appendChild(userRow);
    });

    overlay.appendChild(list);
    return overlay;
}

// При загрузке
(async () => {
    await loadUsers();

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const u = users.find(u => u.name === currentUser);
        if (u) {
            u.isOnline = true;
            document.getElementById("login-screen").style.display = "none";
            document.querySelector(".header-username").textContent = u.name;
            addLogoutButton();
            if (u.name === "ivan2012") addAdminButton();
            await saveAllUsers();
        }
    }
})();
// chat -->
const chatBinId = '681797c58960c979a5934d0e';
const chatApiKey = '$2a$10$yPmfYr5C/ehRIuUuohHKs.jrYcVuoIxN3hRugD06gr1WPj1htsqgS';
const chatApiUrl = `https://api.jsonbin.io/v3/b/${chatBinId}`;

async function fetchMessages() {
    try {
        const res = await fetch(chatApiUrl, {
            headers: { 'X-Master-Key': chatApiKey }
        });
        const data = await res.json();
        return data.record || [];
    } catch (e) {
        console.error("Fetch error:", e);
        return [];
    }
}

async function saveMessages(messages) {
    try {
        await fetch(chatApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': chatApiKey
            },
            body: JSON.stringify(messages)
        });
    } catch (e) {
        console.error("Save error:", e);
    }
}

function renderMessages(messages) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ''; // Очищаем чат перед рендером
    messages.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = `${msg.name}: ${msg.text}`; // Формат name: сообщение
        div.style.marginBottom = '10px'; // Отступ между сообщениями
        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // Прокручиваем чат вниз
}

async function loadAndRenderMessages() {
    const messages = await fetchMessages();
    renderMessages(messages);
}

async function sendMessage(e) {
    if (e.key !== "Enter") return; // Отправка только по Enter

    const input = document.getElementById("chat-input");
    const name = localStorage.getItem("currentUser") || "tuntematon"; // Если пользователь не авторизован, будет "tuntematon"
    const text = input.value.trim();
    if (!text) return;

    let messages = await fetchMessages();
    messages.push({ name, text });

    if (messages.length > 50) {
        messages = messages.slice(messages.length - 50); // Оставляем только последние 50 сообщений
    }

    await saveMessages(messages);
    input.value = ''; // Очищаем поле ввода
    renderMessages(messages); // Обновляем отображение сообщений
}

setInterval(loadAndRenderMessages, 1500); // Загружаем сообщения каждые 500 миллисекунд (полсекунды)
loadAndRenderMessages();

document.getElementById("chat-input").addEventListener("keydown", sendMessage); // Отправка сообщений по нажатию Enter
