// Константы элементов
const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTrackTitle');
const playerCover = document.getElementById('playerCover');

let isLoginMode = false;

// 1. Переключение вкладки Вход/Регистрация
function switchAuthMode(mode) {
    const regFields = document.getElementById('register-only-fields');
    const authBtn = document.getElementById('authBtn');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (mode === 'login') {
        isLoginMode = true;
        regFields.style.display = 'none';
        authBtn.innerText = 'Войти';
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
    } else {
        isLoginMode = false;
        regFields.style.display = 'block';
        authBtn.innerText = 'Зарегистрироваться';
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// 2. Главная кнопка авторизации
async function handleAuthSubmit() {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value.trim();

    if (!username || !password) return alert("Бро, заполни поля!");

    if (isLoginMode) {
        try {
            const response = await fetch('http://localhost:8081/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Пришло от сервера:", data);

                localStorage.setItem('username', data.username);
                const role = data.role ? data.role.toString().toUpperCase() : "";

                if (role.includes('ARTIST')) {
                    console.log("Доступ разрешен: Консоль Артиста открыта!");
                    document.getElementById('toArtistConsole').style.display = 'block';
                } else {
                    document.getElementById('toArtistConsole').style.display = 'none';
                }

                showView('main-page');
                fetchTracks();
            } else {
                const errText = await response.text();
                alert("Ошибка сервера: " + errText);
            }
        } catch (e) {
            console.error("Ошибка сети:", e);
            alert("Проблема со связью. Проверь, запущен ли бэкенд!");
        }
    } else {
        handleRegister();
    }
}

// 3. Регистрация нового аккаунта
async function handleRegister() {
    const username = document.getElementById('authUsername').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isArtist = document.getElementById('isArtistCheck').checked;
    const artistName = document.getElementById('authArtistName').value;

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
            alert("Красава! Ты в базе. Теперь заходи.");
            switchAuthMode('login');
        } else {
            const err = await response.text();
            alert("Ошибка регистрации: " + err);
        }
    } catch (e) {
        alert("Бэкенд в ауте!");
    }
}

// 4. Менеджер экранов (Навигация)
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';

    const playerBar = document.getElementById('player-bar');
    playerBar.style.display = (viewId === 'auth-page') ? 'none' : 'flex';
}

function toggleArtistInput() {
    const isArtist = document.getElementById('isArtistCheck').checked;
    document.getElementById('artistNameField').style.display = isArtist ? 'block' : 'none';
}

// 5. Загрузка треков для Главной
async function fetchTracks(query = '') {
    try {
        const url = query ? `http://localhost:8081/api/v1/tracks?search=${query}` : 'http://localhost:8081/api/v1/tracks';
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        renderTracks(data);
    } catch (e) {
        trackList.innerHTML = '<p class="status-msg">Не удалось загрузить треки...</p>';
    }
}

// 6. Отрисовка треков на Главной странице
function renderTracks(tracks) {
    trackList.innerHTML = '';
    if (!tracks || tracks.length === 0) {
        trackList.innerHTML = '<p class="status-msg">Пока здесь тишина...</p>';
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
                    ${track.artistName || 'Unknown Artist'}
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

// 7. Воспроизведение музыки и обновление нижнего плеера
function playTrack(url, title, cover, artistName, artistId) {
    if (!url) return alert("У этого трека нет аудиофайла, бро!");

    mainAudio.src = `http://localhost:8081/media/tracks/${url}`;
    mainAudio.play().catch(e => console.error("Ошибка воспроизведения:", e));

    currentTitle.innerText = title;
    playerCover.src = cover;

    const playerArtistContainer = document.getElementById('currentTrackArtist');

    if (playerArtistContainer) {
        playerArtistContainer.innerHTML = `
            <span class="player-artist-link" style="color: #b3b3b3; cursor: pointer; font-size: 14px; transition: color 0.2s;">
                ${artistName || 'Unknown Artist'}
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

// 8. Логика перехода к персональной странице артиста
function goToArtistPage(artistId, artistName) {
    console.log(`Переход к артисту. ID: ${artistId}, Имя: ${artistName}`);
    if (!artistId) return alert("У этого исполнителя нет цифрового профиля.");

    showView('artist-profile-page');
    const container = document.getElementById('artist-profile-page');

    container.innerHTML = `
        <div class="artist-header" style="padding: 20px; background: linear-gradient(transparent, #121212), #282828; margin-bottom: 20px; border-radius: 8px;">
            <button onclick="showView('main-page')" style="background: #1db954; color: #fff; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold; margin-bottom: 15px;">
                ← Назад на Главную
            </button>
            <h1 style="color: #fff; font-size: 48px; margin: 0;">${artistName}</h1>
            <p style="color: #b3b3b3; margin: 5px 0 0 0;">Официальный профиль исполнителя</p>
        </div>
        <h3 style="color: #fff; margin-left: 20px; margin-bottom: 15px;">Все релизы</h3>
        <div id="artistTrackList" class="track-grid"></div>
    `;

    fetchArtistTracks(artistId);
}

// 9. Запрос треков конкретного артиста с бэкенда
async function fetchArtistTracks(artistId) {
    const artistTrackList = document.getElementById('artistTrackList');
    try {
        const res = await fetch(`http://localhost:8081/api/v1/tracks?artistId=${artistId}`);
        if (!res.ok) throw new Error("Не удалось загрузить треки артиста");

        const tracks = await res.json();
        artistTrackList.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            artistTrackList.innerHTML = '<p class="status-msg" style="color: #b3b3b3; margin-left: 20px;">У этого артиста пока нет треков...</p>';
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
        artistTrackList.innerHTML = '<p class="status-msg" style="color: red; margin-left: 20px;">Ошибка при загрузке дискографии...</p>';
    }
}

// 10. Загрузка новых файлов через консоль артиста
async function uploadFile() {
    const trackFileInput = document.getElementById('trackFile');
    const coverFileInput = document.getElementById('coverFile');

    if (!trackFileInput || !trackFileInput.files[0]) {
        return alert("Выбери MP3 файл!");
    }

    const trackFile = trackFileInput.files[0];
    const coverFile = coverFileInput ? coverFileInput.files[0] : null;

    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
        return alert("Бро, ты не авторизован! Перезайди в аккаунт.");
    }

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
            alert("Трек на сервере!");
            showView('main-page');
            fetchTracks();

            trackFileInput.value = '';
            if (coverFileInput) coverFileInput.value = '';
        } else {
            const errText = await response.text();
            alert("Ошибка загрузки: " + errText);
        }
    } catch (e) {
        console.error("Ошибка при отправке трека:", e);
        alert("Бэкенд отвалился при загрузке");
    }
}

// Поиск по инпуту
searchInput.addEventListener('input', (e) => fetchTracks(e.target.value));

// Старт
window.onload = () => showView('auth-page');