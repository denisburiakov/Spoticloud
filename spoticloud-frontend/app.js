// Константы элементов
const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTrackTitle');
const playerCover = document.getElementById('playerCover');
const langSelect = document.getElementById('langSelect');

let isLoginMode = false;
// Читаем язык из localStorage, если там пусто — ставим русский по дефолту
let currentLang = localStorage.getItem('lang') || 'ru';

// Расширенный словарь переводов для ВСЕХ страниц приложения
const translations = {
    ru: {
        tabLogin: "Вход",
        tabRegister: "Регистрация",
        labelArtist: "Я артист",
        btnRegister: "Зарегистрироваться",
        btnLogin: "Войти",
        placeholderUsername: "Логин (Username)",
        placeholderEmail: "Email",
        placeholderArtistName: "Твоё сценическое имя",
        placeholderPassword: "Пароль",
        sidebarTitle: "Профиль",
        btnLogout: "Выйти из аккаунта",

        // Главная страница
        mainHeader: "Главная",
        placeholderSearch: "Поиск любимых треков...",
        btnToConsole: "Для артистов",
        statusLoading: "Загрузка музыки...",
        statusSilence: "Пока здесь тишина...",

        // Консоль артиста
        btnBack: "← Назад",
        consoleHeader: "Консоль артиста",
        uploadTitle: "Добавить новый сингл",
        labelTrackFile: "Файл трека (.mp3):",
        labelCoverFile: "Обложка (image):",
        btnPublish: "Опубликовать в SpotiCloud",
        hintFormat: "* Формат названия файла: Артист - Название.mp3",

        // Плеер
        playerDefaultTitle: "Выберите трек",
        playerDefaultArtist: "Исполнитель",
        playerUnknownArtist: "Неизвестный артист",

        // Страница артиста (динамическая)
        profileBackBtn: "← Назад на Главную",
        profileSubTitle: "Официальный профиль исполнителя",
        profileReleases: "Все релизы",
        profileNoTracks: "У этого артиста пока нет треков...",

        // Алерт-логи
        alertEmpty: "Бро, заполни поля!",
        alertWeakPass: "Пароль слишком слабый, бро!\n\nТребования:\n— Минимум 8 символов\n— Минимум одна буква (латиница или кириллица)\n— Минимум один спецсимвол (!@#$%^&*...)",
        alertNotAuth: "Бро, ты не авторизован! Перезайди в аккаунт.",
        alertSelectMp3: "Выбери MP3 файл!",
        alertUploadSuccess: "Трек на сервере!",
        alertNoAudio: "У этого трека нет аудиофайла, бро!",
        alertNoArtistProfile: "У этого исполнителя нет цифрового профиля, бро.",
        alertBackendError: "Бэкенд отвалился или в ауте!",
        alertRegSuccess: "Красава! Ты в базе. Теперь заходи."
    },
    en: {
        tabLogin: "Login",
        tabRegister: "Register",
        labelArtist: "I am an artist",
        btnRegister: "Sign Up",
        btnLogin: "Sign In",
        placeholderUsername: "Username",
        placeholderEmail: "Email",
        placeholderArtistName: "Your stage name",
        placeholderPassword: "Password",

        // Главная страница
        mainHeader: "Main Page",
        placeholderSearch: "Search your favorite tracks...",
        btnToConsole: "Artist Console",
        statusLoading: "Loading music...",
        statusSilence: "It's quiet here for now...",
        sidebarTitle: "Profile",
        btnLogout: "Log Out",

        // Консоль артиста
        btnBack: "← Back",
        consoleHeader: "Artist Console",
        uploadTitle: "Add a new single",
        labelTrackFile: "Track file (.mp3):",
        labelCoverFile: "Cover image:",
        btnPublish: "Publish in SpotiCloud",
        hintFormat: "* File name format: Artist - Title.mp3",

        // Плеер
        playerDefaultTitle: "Select a track",
        playerDefaultArtist: "Artist",
        playerUnknownArtist: "Unknown Artist",

        // Страница артиста (динамическая)
        profileBackBtn: "← Back to Home",
        profileSubTitle: "Official artist profile",
        profileReleases: "All releases",
        profileNoTracks: "No tracks found for this artist...",

        // Алерт-логи
        alertEmpty: "Bro, fill in the fields!",
        alertWeakPass: "Password is too weak, bro!\n\nRequirements:\n— Minimum 8 characters\n— Minimum one letter\n— Minimum one special character (!@#$%^&*...)",
        alertNotAuth: "Bro, you are not authorized! Please log in again.",
        alertSelectMp3: "Please select an MP3 file!",
        alertUploadSuccess: "Track uploaded to server successfully!",
        alertNoAudio: "This track has no audio file, bro!",
        alertNoArtistProfile: "This artist doesn't have a digital profile, bro.",
        alertBackendError: "Backend is dead or down!",
        alertRegSuccess: "Success! You are in the database. Now log in."
    }
};

// Функция переключения языка (с сохранением в памяти браузере)
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang); // Жестко запоминаем выбор
    if (langSelect) langSelect.value = lang; // Синхронизируем выпадашку visual-часть

    const dict = translations[lang];

    // 1. Переводим обычный текст по дата-атрибутам во ВСЕМ HTML
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (key === 'btnRegister' || key === 'btnLogin') {
            el.innerText = isLoginMode ? dict.btnLogin : dict.btnRegister;
        } else {
            el.innerText = dict[key];
        }
    });

    // 2. Переводим все плейсхолдеры в инпутах
    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        el.placeholder = dict[key];
    });
}

// Переключение вкладок (Вход/Регистрация)
function switchAuthMode(mode) {
    const regFields = document.getElementById('register-only-fields');
    const authBtn = document.getElementById('authBtn');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    const dict = translations[currentLang];

    if (mode === 'login') {
        isLoginMode = true;
        regFields.style.display = 'none';
        authBtn.innerText = dict.btnLogin;
        authBtn.setAttribute('data-translate', 'btnLogin');
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
    } else {
        isLoginMode = false;
        regFields.style.display = 'block';
        authBtn.innerText = dict.btnRegister;
        authBtn.setAttribute('data-translate', 'btnRegister');
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// Главная кнопка авторизации
async function handleAuthSubmit() {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value.trim();

    if (!username || !password) return alert(translations[currentLang].alertEmpty);

    if (isLoginMode) {
        try {
            const response = await fetch('http://localhost:8081/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('username', data.username);

                const role = data.role ? data.role.toString().toUpperCase() : "USER";
                localStorage.setItem('role', role); // сохраняем роль

                // Заполняем инфу в сайдбаре
                document.getElementById('sidebarUsername').innerText = data.username;
                document.getElementById('sidebarRole').innerText = role.includes('ARTIST') ? 'Artist' : 'User';

                if (role.includes('ARTIST')) {
                    document.getElementById('toArtistConsole').style.display = 'block';
                } else {
                    document.getElementById('toArtistConsole').style.display = 'none';
                }

                showView('main-page');
                fetchTracks();
            } else {
                const errText = await response.text();
                alert("Error: " + errText);
            }
        } catch (e) {
            console.error(e);
            alert(translations[currentLang].alertBackendError);
        }
    } else {
        handleRegister();
    }
}

// Регистрация нового аккаунта
async function handleRegister() {
    const username = document.getElementById('authUsername').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isArtist = document.getElementById('isArtistCheck').checked;
    const artistName = document.getElementById('authArtistName').value;

    const passwordRegex = /^(?=.*[A-Za-zА-Яа-я])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
        return alert(translations[currentLang].alertWeakPass);
    }

    const registerData = {
        username,
        email,
        password,
        isArtist,
        artistName: isArtist ? artistName : null
    };

    try {
        const response = await fetch('http://localhost:8081/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        if (response.ok) {
            alert(translations[currentLang].alertRegSuccess);
            switchAuthMode('login');
        } else {
            const err = await response.text();
            alert("Error: " + err);
        }
    } catch (e) {
        alert(translations[currentLang].alertBackendError);
    }
}

// Менеджер экранов (Навигация)
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';

    const playerBar = document.getElementById('player-bar');
    if (playerBar) {
        playerBar.style.display = (viewId === 'auth-page') ? 'none' : 'flex';
    }
}

// Переключение видимости поля с именем артиста при регистрации
function toggleArtistInput() {
    const isArtist = document.getElementById('isArtistCheck').checked;
    document.getElementById('artistNameField').style.display = isArtist ? 'block' : 'none';
}

// Загрузка треков для Главной
async function fetchTracks(query = '') {
    try {
        const url = query ? `http://localhost:8081/api/v1/tracks?search=${query}` : 'http://localhost:8081/api/v1/tracks';
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        renderTracks(data);
    } catch (e) {
        trackList.innerHTML = `<p class="status-msg">${translations[currentLang].alertBackendError}</p>`;
    }
}

// Отрисовка треков на Главной странице
function renderTracks(tracks) {
    trackList.innerHTML = '';
    if (!tracks || tracks.length === 0) {
        trackList.innerHTML = `<p class="status-msg">${translations[currentLang].statusSilence}</p>`;
        return;
    }

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';

        let coverName = track.coverUrl ? track.coverUrl.split('\\').pop().split('/').pop() : null;
        const coverImg = coverName
            ? `http://localhost:8081/media/covers/${coverName}`
            : 'https://via.placeholder.com/200/282828/FFFFFF?text=Music';

        let cleanTitle = track.title || 'Без названия';
        if (cleanTitle.includes(' - ')) {
            cleanTitle = cleanTitle.split(' - ').pop();
        }

        card.innerHTML = `
            <img src="${coverImg}" alt="cover" onerror="this.src='https://via.placeholder.com/200/282828/FFFFFF?text=No+Cover'">
            <div class="card-info" style="display: flex; flex-direction: column; gap: 4px; padding: 10px 0;">
                <strong class="track-title" style="display: block; font-size: 16px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${cleanTitle}
                </strong>
                <span class="artist-link" style="color: #b3b3b3; font-size: 14px; cursor: pointer; display: inline-block; width: fit-content; transition: color 0.2s;">
                    ${track.artistName || translations[currentLang].playerUnknownArtist}
                </span>
            </div>
        `;

        let audioName = track.audioUrl ? track.audioUrl.split('\\').pop().split('/').pop() : '';
        card.onclick = () => playTrack(audioName, cleanTitle, coverImg, track.artistName, track.artistId);

        const artistBtn = card.querySelector('.artist-link');
        artistBtn.onmouseenter = () => { artistBtn.style.color = '#1db954'; artistBtn.style.textDecoration = 'underline'; };
        artistBtn.onmouseleave = () => { artistBtn.style.color = '#b3b3b3'; artistBtn.style.textDecoration = 'none'; };

        artistBtn.onclick = (event) => {
            event.stopPropagation();
            goToArtistPage(track.artistId, track.artistName);
        };

        trackList.appendChild(card);
    });
}

// Воспроизведение музыки и обновление нижнего плеера
function playTrack(url, title, cover, artistName, artistId) {
    if (!url) return alert(translations[currentLang].alertNoAudio);

    mainAudio.src = `http://localhost:8081/media/tracks/${url}`;
    mainAudio.play().catch(e => console.error("Ошибка воспроизведения:", e));

    currentTitle.innerText = title;
    playerCover.src = cover;

    const playerArtistContainer = document.getElementById('currentTrackArtist');

    if (playerArtistContainer) {
        playerArtistContainer.innerHTML = `
            <span class="player-artist-link" style="color: #b3b3b3; cursor: pointer; font-size: 14px; transition: color 0.2s;">
                ${artistName || translations[currentLang].playerUnknownArtist}
            </span>
        `;

        const playerArtistLink = playerArtistContainer.querySelector('.player-artist-link');
        playerArtistLink.onmouseenter = () => { playerArtistLink.style.color = '#1db954'; playerArtistLink.style.textDecoration = 'underline'; };
        playerArtistLink.onmouseleave = () => { playerArtistLink.style.color = '#b3b3b3'; playerArtistLink.style.textDecoration = 'none'; };

        playerArtistLink.onclick = () => {
            goToArtistPage(artistId, artistName);
        };
    }
}

// Логика перехода к персональной странице артиста
function goToArtistPage(artistId, artistName) {
    if (!artistId) return alert(translations[currentLang].alertNoArtistProfile);

    showView('artist-profile-page');
    const container = document.getElementById('artist-profile-page');
    const dict = translations[currentLang];

    container.innerHTML = `
        <div class="artist-header" style="padding: 20px; background: linear-gradient(transparent, #121212), #282828; margin-bottom: 20px; border-radius: 8px;">
            <button onclick="showView('main-page')" style="background: #1db954; color: #fff; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold; margin-bottom: 15px;">
                ${dict.profileBackBtn}
            </button>
            <h1 style="color: #fff; font-size: 48px; margin: 0;">${artistName}</h1>
            <p style="color: #b3b3b3; margin: 5px 0 0 0;">${dict.profileSubTitle}</p>
        </div>
        <h3 style="color: #fff; margin-left: 20px; margin-bottom: 15px;">${dict.profileReleases}</h3>
        <div id="artistTrackList" class="track-grid"></div>
    `;

    fetchArtistTracks(artistId);
}

// Запрос треков конкретного артиста с бэкенда
async function fetchArtistTracks(artistId) {
    const artistTrackList = document.getElementById('artistTrackList');
    try {
        const res = await fetch(`http://localhost:8081/api/v1/tracks?artistId=${artistId}`);
        if (!res.ok) throw new Error("Не удалось загрузить треки артиста");

        const tracks = await res.json();
        artistTrackList.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            artistTrackList.innerHTML = `<p class="status-msg" style="color: #b3b3b3; margin-left: 20px;">${translations[currentLang].profileNoTracks}</p>`;
            return;
        }

        tracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'track-card';

            let coverName = track.coverUrl ? track.coverUrl.split('\\').pop().split('/').pop() : null;
            const coverImg = coverName
                ? `http://localhost:8081/media/covers/${coverName}`
                : 'https://via.placeholder.com/200/282828/FFFFFF?text=Music';

            let cleanTitle = track.title || 'Без названия';
            if (cleanTitle.includes(' - ')) {
                cleanTitle = cleanTitle.split(' - ').pop();
            }

            card.innerHTML = `
                <img src="${coverImg}" alt="cover" onerror="this.src='https://via.placeholder.com/200/282828/FFFFFF?text=No+Cover'">
                <div class="card-info" style="display: flex; flex-direction: column; gap: 4px; padding: 10px 0;">
                    <strong class="track-title" style="display: block; font-size: 16px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${cleanTitle}
                    </strong>
                    <span style="color: #b3b3b3; font-size: 14px;">${track.artistName}</span>
                </div>
            `;

            let audioName = track.audioUrl ? track.audioUrl.split('\\').pop().split('/').pop() : '';
            card.onclick = () => playTrack(audioName, cleanTitle, coverImg, track.artistName, track.artistId);

            artistTrackList.appendChild(card);
        });

    } catch (e) {
        console.error(e);
        artistTrackList.innerHTML = '<p class="status-msg" style="color: red; margin-left: 20px;">Error...</p>';
    }
}

// Загрузка новых файлов через консоль артиста
async function uploadFile() {
    const trackFileInput = document.getElementById('trackFile');
    const coverFileInput = document.getElementById('coverFile');

    if (!trackFileInput || !trackFileInput.files[0]) return alert(translations[currentLang].alertSelectMp3);

    const trackFile = trackFileInput.files[0];
    const coverFile = coverFileInput ? coverFileInput.files[0] : null;

    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) return alert(translations[currentLang].alertNotAuth);

    const formData = new FormData();
    formData.append('file', trackFile);
    if (coverFile) {
        formData.append('cover', coverFile);
    }
    formData.append('username', currentUsername);

    try {
        const response = await fetch('http://localhost:8081/api/v1/tracks/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert(translations[currentLang].alertUploadSuccess);
            showView('main-page');
            fetchTracks();

            trackFileInput.value = '';
            if (coverFileInput) coverFileInput.value = '';
        } else {
            const errText = await response.text();
            alert("Error: " + errText);
        }
    } catch (e) {
        console.error(e);
        alert(translations[currentLang].alertBackendError);
    }
}

// Поиск по инпуту
if (searchInput) {
    searchInput.addEventListener('input', (e) => fetchTracks(e.target.value));
}

// Открытие / закрытие сайдбара
function toggleSidebar(open) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar && overlay) {
        if (open) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
}

// Логаут
function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    toggleSidebar(false);
    showView('auth-page');
}

// Вызывается при запуске приложения
window.onload = () => {
    showView('auth-page');
    changeLanguage(currentLang); // Автоматом применяем сохраненный язык при старте
};