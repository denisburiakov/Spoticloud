const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTrackTitle');
const playerCover = document.getElementById('playerCover');
const langSelect = document.getElementById('langSelect');

let isLoginMode = false;
let currentLang = localStorage.getItem('lang') || 'ru';

let artistProfile = JSON.parse(localStorage.getItem('artistProfileData')) || {
    isFilled: false,
    avatar: '',
    background: '',
    listeners: '',
    bio: ''
};

const translations = {
    ru: {
        successSavedBlock: "Карточка артиста успешно обновлена и сохранена.",
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

        mainHeader: "Главная",
        placeholderSearch: "Поиск любимых треков...",
        btnToConsole: "Для артистов",
        btnToProfile: "Мой профиль артиста",
        statusLoading: "Загрузка музыки...",
        statusSilence: "Пока здесь тишина...",

        btnBack: "← Назад",
        consoleHeader: "Консоль артиста",
        uploadTitle: "Добавить новый сингл",
        labelTrackFile: "Файл трека (.mp3):",
        labelCoverFile: "Обложка (image):",
        btnPublish: "Опубликовать в SpotiCloud",
        hintFormat: "* Формат названия файла: Артист - Название.mp3",
        btnChooseTrack: "Выбрать MP3",
        btnChooseCover: "Выбрать обложку",
        fileNotSelected: "Файл не выбран",

        artistProfileTitle: "Профиль артиста",
        warningNotFilled: "Заполните карточку артиста, чтобы слушатели могли узнать о вас больше.",
        formTitleFill: "Заполните карточку артиста",
        formTitleEdit: "Редактировать карточку артиста",
        labelAvatar: "Фотокарточка артиста (Аватар):",
        labelBg: "Баннер профиля (Задний фон):",
        labelListeners: "Количество ежемесячных слушателей:",
        labelBio: "Описание артиста (Биография):",
        placeholderListeners: "Например: 145000",
        placeholderBio: "Расскажите свою историю, добавьте ссылки на соцсети...",
        btnSaveProfile: "Сохранить профиль",
        btnCancel: "Отмена",
        btnEditProfile: "Редактировать профиль",
        verifiedArtist: "✓ Подтвержденный артист",
        listenersSuffix: "слушателей за месяц",
        bioEmpty: "Описание отсутствует.",
        btnChooseAvatar: "Выбрать аватар",
        btnChooseBg: "Выбрать баннер",

        profileBackBtn: "← Назад на Главную",
        profileSubTitle: "Официальный профиль исполнителя",
        profileReleases: "Все релизы",
        profileNoTracks: "У этого артиста пока нет треков...",

        alertEmpty: "Заполните обязательные поля.",
        alertWeakPass: "Пароль не соответствует требованиям безопасности.\n\nТребования:\n— Минимум 8 символов\n— Минимум одна буква\n— Минимум один спецсимвол (!@#$%^&*...)",
        alertNotAuth: "Вы не авторизованы. Пожалуйста, войдите в аккаунт повторно.",
        alertSelectMp3: "Выберите MP3 файл.",
        alertUploadSuccess: "Трек успешно загружен на сервер.",
        alertNoAudio: "У этого трека отсутствует аудиофайл.",
        alertNoArtistProfile: "У данного исполнителя не запущен цифровой профиль.",
        alertBackendError: "Ошибка соединения с сервером.",
        alertRegSuccess: "Регистрация успешно завершена. Вы можете войти.",
        alertFormError: "Пожалуйста, укажите количество слушателей и заполните описание.",
        alertSaveSuccess: "Профиль артиста успешно сохранен."
    },
    en: {
        successSavedBlock: "Artist profile has been successfully updated and saved.",
        tabLogin: "Login",
        tabRegister: "Register",
        labelArtist: "I am an artist",
        btnRegister: "Sign Up",
        btnLogin: "Sign In",
        placeholderUsername: "Username",
        placeholderEmail: "Email",
        placeholderArtistName: "Your stage name",
        placeholderPassword: "Password",
        sidebarTitle: "Profile",
        btnLogout: "Log Out",

        mainHeader: "Main Page",
        placeholderSearch: "Search your favorite tracks...",
        btnToConsole: "Artist Console",
        btnToProfile: "My Artist Profile",
        statusLoading: "Loading music...",
        statusSilence: "It's quiet here for now...",

        btnBack: "← Back",
        consoleHeader: "Artist Console",
        uploadTitle: "Add a new single",
        labelTrackFile: "Track file (.mp3):",
        labelCoverFile: "Cover image:",
        btnPublish: "Publish in SpotiCloud",
        hintFormat: "* File name format: Artist - Title.mp3",
        btnChooseTrack: "Choose MP3",
        btnChooseCover: "Choose cover",
        fileNotSelected: "No file chosen",

        artistProfileTitle: "Artist Profile",
        warningNotFilled: "Please fill out your artist card so listeners can know more about you.",
        formTitleFill: "Fill out your artist card",
        formTitleEdit: "Edit artist card",
        labelAvatar: "Artist Photo (Avatar):",
        labelBg: "Profile Banner (Background):",
        labelListeners: "Monthly listeners count:",
        labelBio: "Artist Bio (Biography):",
        placeholderListeners: "e.g., 145000",
        placeholderBio: "Tell your story, add social links...",
        btnSaveProfile: "Save Profile",
        btnCancel: "Cancel",
        btnEditProfile: "Edit Profile",
        verifiedArtist: "✓ Verified Artist",
        listenersSuffix: "monthly listeners",
        bioEmpty: "No biography provided.",
        btnChooseAvatar: "Choose avatar",
        btnChooseBg: "Choose banner",

        profileBackBtn: "← Back to Home",
        profileSubTitle: "Official artist profile",
        profileReleases: "All releases",
        profileNoTracks: "No tracks found for this artist...",

        alertEmpty: "Please fill in the required fields.",
        alertWeakPass: "Password does not meet security requirements.\n\nRequirements:\n— Minimum 8 characters\n— Minimum one letter\n— Minimum one special character (!@#$%^&*...)",
        alertNotAuth: "You are not authorized. Please log in again.",
        alertSelectMp3: "Please select an MP3 file.",
        alertUploadSuccess: "Track uploaded successfully.",
        alertNoAudio: "This track has no audio file available.",
        alertNoArtistProfile: "This artist doesn't have an active digital profile.",
        alertBackendError: "Server connection error.",
        alertRegSuccess: "Registration successful. You can now log in.",
        alertFormError: "Please fill in the listeners count and biography description.",
        alertSaveSuccess: "Artist profile saved successfully."
    }
};

const backBtnStyles = `
    background: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    padding: 8px 18px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s ease;
    outline: none;
`;

function applyBackBtnHover(btn) {
    if (!btn) return;
    btn.onmouseenter = () => {
        btn.style.borderColor = '#1db954';
        btn.style.color = '#1db954';
        btn.style.backgroundColor = 'rgba(29, 185, 84, 0.05)';
    };
    btn.onmouseleave = () => {
        btn.style.borderColor = '#333';
        btn.style.color = '#fff';
        btn.style.backgroundColor = '#1a1a1a';
    };
}

async function checkAndRenderArtistProfile() {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) return;

    const dict = translations[currentLang];

    const warningBlock = document.getElementById('artist-profile-warning');
    const successBlock = document.getElementById('artist-profile-success');
    const displayBlock = document.getElementById('artist-profile-display');
    const formBlock = document.getElementById('artist-profile-form');
    const cancelBtn = document.getElementById('cancelArtistEditBtn');
    const formTitle = document.getElementById('formActionTitle');

    if (warningBlock) warningBlock.innerText = dict.warningNotFilled;
    if (successBlock) successBlock.innerText = dict.successSavedBlock;

    if (formBlock) {
        const labels = formBlock.querySelectorAll('label');
        if (labels && labels.length >= 4) {
            labels[0].innerText = dict.labelAvatar;
            labels[1].innerText = dict.labelBg;
            labels[2].innerText = dict.labelListeners;
            labels[3].innerText = dict.labelBio;
        }
        const saveBtn = formBlock.querySelector('.btn-main');
        if (saveBtn) saveBtn.innerText = dict.btnSaveProfile;
    }

    if (document.getElementById('artistListenersInput')) document.getElementById('artistListenersInput').placeholder = dict.placeholderListeners;
    if (document.getElementById('artistBioInput')) document.getElementById('artistBioInput').placeholder = dict.placeholderBio;
    if (cancelBtn) cancelBtn.innerText = dict.btnCancel;

    if (displayBlock) {
        const editBtn = displayBlock.querySelector('.btn-outline');
        if (editBtn) editBtn.innerText = dict.btnEditProfile;
        const badge = displayBlock.querySelector('.verified-badge');
        if (badge) badge.innerText = dict.verifiedArtist;
    }

    if (document.getElementById('artistDisplayName')) document.getElementById('artistDisplayName').innerText = currentUsername;

    try {
        console.log(`Fetch профиля для: ${currentUsername}`);
        // Стучимся ровно на твой эндпоинт контроллера
        const response = await fetch(`http://localhost:8081/api/v1/artist/profile?username=${currentUsername}`);

        // СЛУЧАЙ А: 404 (в бэке сработал .orElse(ResponseEntity.notFound().build()))
        if (response.status === 404) {
            if (warningBlock) warningBlock.style.display = 'block';
            if (successBlock) successBlock.style.display = 'none';
            if (displayBlock) displayBlock.style.display = 'none';
            if (formBlock) formBlock.style.display = 'block';
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (formTitle) formTitle.innerText = dict.formTitleFill;
            return;
        }

        // СЛУЧАЙ Б: Профиль успешно получен (200 OK)
        if (response.ok) {
            const profileData = await response.json();

            // Кэшируем для редактора
            artistProfile.listeners = profileData.listeners || 0;
            artistProfile.bio = profileData.bio || '';

            if (warningBlock) warningBlock.style.display = 'none';
            if (displayBlock) displayBlock.style.display = 'flex';
            if (formBlock) formBlock.style.display = 'none';
            if (formTitle) formTitle.innerText = dict.formTitleEdit;

            // Выводим количество слушателей из твоего Map.of("listeners", ...)
            const formattedListeners = Number(profileData.listeners || 0).toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US');
            const listenersDisplay = document.getElementById('artistDisplayListeners');
            if (listenersDisplay) {
                listenersDisplay.innerText = formattedListeners;
                const parent = listenersDisplay.parentNode;
                if (parent) parent.innerHTML = `<span id="artistDisplayListeners">${formattedListeners}</span> ${dict.listenersSuffix}`;
            }

            if (document.getElementById('artistDisplayBio')) {
                document.getElementById('artistDisplayBio').innerText = profileData.bio || dict.bioEmpty;
            }

            // ИСПРАВЛЕНО: Склеиваем аватарку с хостом Spring Boot
            if (document.getElementById('artistDisplayAvatar')) {
                document.getElementById('artistDisplayAvatar').src = profileData.avatarUrl
                    ? `http://localhost:8081${profileData.avatarUrl}`
                    : 'https://via.placeholder.com/150';
            }

            // ИСПРАВЛЕНО: Склеиваем баннер с хостом Spring Boot
            const heroBg = document.getElementById('artistHeroBg');
            if (heroBg) {
                if (profileData.backgroundUrl) {
                    heroBg.style.backgroundImage = `url('http://localhost:8081${profileData.backgroundUrl}')`;
                } else {
                    heroBg.style.backgroundImage = 'none';
                    heroBg.style.backgroundColor = '#282828';
                }
            }
        }
    } catch (e) {
        console.error("Ошибка при получении профиля:", e);
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    if (langSelect) langSelect.value = lang;

    const dict = translations[lang];

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (!dict[key] && key !== 'btnRegister' && key !== 'btnLogin') return;
        if (key === 'btnRegister' || key === 'btnLogin') {
            el.innerText = isLoginMode ? dict.btnLogin : dict.btnRegister;
        } else {
            el.innerText = dict[key];
        }
    });

    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });

    const toProfileBtn = document.getElementById('toArtistProfile');
    if (toProfileBtn) toProfileBtn.innerText = dict.btnToProfile;

    const allBackButtons = document.querySelectorAll(
        '#artist-profile-page button[onclick*="showView"], #artist-console-page button[onclick*="showView"], #artist-public-page button[onclick*="showView"]'
    );
    allBackButtons.forEach(btn => {
        btn.innerText = dict.btnBack;
    });

    const trackFileInput = document.getElementById('trackFile');
    const coverFileInput = document.getElementById('coverFile');
    if (trackFileInput) setupCustomFileInput(trackFileInput, 'custom-track-file-btn', 'custom-track-file-text', dict.btnChooseTrack, dict.fileNotSelected);
    if (coverFileInput) setupCustomFileInput(coverFileInput, 'custom-cover-file-btn', 'custom-cover-file-text', dict.btnChooseCover, dict.fileNotSelected);

    const profilePage = document.getElementById('artist-profile-page');
    if (profilePage && (profilePage.style.display === 'block' || profilePage.style.display === 'flex')) {
        checkAndRenderArtistProfile();
    }
}

function switchAuthMode(mode) {
    const regFields = document.getElementById('register-only-fields');
    const authBtn = document.getElementById('authBtn');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    const dict = translations[currentLang];

    if (mode === 'login') {
        isLoginMode = true;
        if (regFields) regFields.style.display = 'none';
        if (authBtn) {
            authBtn.innerText = dict.btnLogin;
            authBtn.setAttribute('data-translate', 'btnLogin');
        }
        if (tabLogin) tabLogin.classList.add('active');
        if (tabReg) tabReg.classList.remove('active');
    } else {
        isLoginMode = false;
        if (regFields) regFields.style.display = 'block';
        if (authBtn) {
            authBtn.innerText = dict.btnRegister;
            authBtn.setAttribute('data-translate', 'btnRegister');
        }
        if (tabReg) tabReg.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
    }
}

async function handleAuthSubmit() {
    const usernameEl = document.getElementById('authUsername');
    const passwordEl = document.getElementById('authPassword');
    if (!usernameEl || !passwordEl) return;

    const username = usernameEl.value;
    const password = passwordEl.value.trim();

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
                localStorage.setItem('role', role);

                if (document.getElementById('sidebarUsername')) document.getElementById('sidebarUsername').innerText = data.username;
                if (document.getElementById('sidebarRole')) {
                    document.getElementById('sidebarRole').innerText = role.includes('ARTIST') ? 'Artist' : 'User';
                }

                if (role.includes('ARTIST')) {
                    if (document.getElementById('toArtistConsole')) document.getElementById('toArtistConsole').style.display = 'block';
                    if (document.getElementById('toArtistProfile')) document.getElementById('toArtistProfile').style.display = 'block';
                } else {
                    if (document.getElementById('toArtistConsole')) document.getElementById('toArtistConsole').style.display = 'none';
                    if (document.getElementById('toArtistProfile')) document.getElementById('toArtistProfile').style.display = 'none';
                }

                showView('main-page');
                fetchTracks();
            } else {
                alert("Error: " + await response.text());
            }
        } catch (e) {
            console.error(e);
            alert(translations[currentLang].alertBackendError);
        }
    } else {
        handleRegister();
    }
}

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

    const registerData = { username, email, password, isArtist, artistName: isArtist ? artistName : null };

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
            alert("Error: " + await response.text());
        }
    } catch (e) {
        alert(translations[currentLang].alertBackendError);
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

    const targetView = document.getElementById(viewId);
    if (targetView) targetView.style.display = 'block';

    const playerBar = document.getElementById('player-bar');
    if (playerBar) {
        playerBar.style.display = (viewId === 'auth-page') ? 'none' : 'flex';
    }

    if (viewId === 'artist-profile-page') {
        checkAndRenderArtistProfile();
    }
    if (viewId === 'artist-console-page') {
        changeLanguage(currentLang);
    }
}

function toggleArtistInput() {
    const isArtistCheck = document.getElementById('isArtistCheck');
    const artistField = document.getElementById('artistNameField');
    if (isArtistCheck && artistField) {
        artistField.style.display = isArtistCheck.checked ? 'block' : 'none';
    }
}

function setupCustomFileInput(inputEl, btnId, textId, btnLabel, defaultText) {
    if (!inputEl) return;
    if (inputEl.classList.contains('hidden-file-input')) {
        const existingBtn = document.getElementById(btnId);
        const existingTxt = document.getElementById(textId);
        if (existingBtn) existingBtn.innerText = btnLabel;
        if (existingTxt && (existingTxt.innerText === translations.ru.fileNotSelected || existingTxt.innerText === translations.en.fileNotSelected)) {
            existingTxt.innerText = defaultText;
        }
        return;
    }

    inputEl.classList.add('hidden-file-input');
    inputEl.style.display = 'none';

    const container = document.createElement('div');
    container.className = 'custom-file-container';

    const customBtn = document.createElement('button');
    customBtn.type = 'button';
    customBtn.id = btnId;
    customBtn.className = 'custom-file-trigger';
    customBtn.innerText = btnLabel;

    const customText = document.createElement('span');
    customText.id = textId;
    customText.className = 'custom-file-text';
    customText.innerText = defaultText;

    customBtn.onclick = () => inputEl.click();

    inputEl.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            customText.innerText = e.target.files[0].name;
            customText.classList.add('file-selected');
        } else {
            customText.innerText = translations[currentLang].fileNotSelected;
            customText.classList.remove('file-selected');
        }
    });

    container.appendChild(customBtn);
    container.appendChild(customText);
    if (inputEl.parentNode) inputEl.parentNode.appendChild(container);
}

// ================= ЛИЧНЫЙ КАБИНЕТ АРТИСТА (СВЯЗКА С ТВОИМ БЭКЕНДОМ) =================



function openArtistEditor() {
    const dict = translations[currentLang];
    if (document.getElementById('artist-profile-form')) document.getElementById('artist-profile-form').style.display = 'block';
    if (document.getElementById('cancelArtistEditBtn')) document.getElementById('cancelArtistEditBtn').style.display = 'inline-block';
    if (document.getElementById('formActionTitle')) document.getElementById('formActionTitle').innerText = dict.formTitleEdit;

    if (document.getElementById('artistListenersInput')) document.getElementById('artistListenersInput').value = artistProfile.listeners;
    if (document.getElementById('artistBioInput')) document.getElementById('artistBioInput').value = artistProfile.bio;

    const successBlock = document.getElementById('artist-profile-success');
    if (successBlock) successBlock.style.display = 'none';
}

function closeArtistEditor() {
    if (document.getElementById('artist-profile-form')) document.getElementById('artist-profile-form').style.display = 'none';
    if (document.getElementById('artist-profile-display')) document.getElementById('artist-profile-display').style.display = 'flex';
}

async function saveArtistProfile() {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) return alert(translations[currentLang].alertNotAuth);

    const listeners = document.getElementById('artistListenersInput').value;
    const bio = document.getElementById('artistBioInput').value.trim();
    const avatarFile = document.getElementById('artistAvatarFile');
    const bgFile = document.getElementById('artistBgFile');

    if (!listeners || !bio) return alert(translations[currentLang].alertFormError);

    // Пакуем Multipart FormData точь-в-точь как требует твой `@PostMapping`
    const formData = new FormData();
    formData.append('username', currentUsername);
    formData.append('listeners', listeners);
    formData.append('bio', bio);

    if (avatarFile && avatarFile.files[0]) formData.append('avatar', avatarFile.files[0]);
    if (bgFile && bgFile.files[0]) formData.append('background', bgFile.files[0]);

    try {
        const response = await fetch('http://localhost:8081/api/v1/artist/profile', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            closeArtistEditor();
            await checkAndRenderArtistProfile();
            if (document.getElementById('artist-profile-success')) {
                document.getElementById('artist-profile-success').style.display = 'block';
            }
        } else {
            alert("Ошибка сохранения: " + await response.text());
        }
    } catch (e) {
        console.error(e);
        alert(translations[currentLang].alertBackendError);
    }
}

// ================= ЛОГИКА ГЛАВНОЙ СТРАНИЦЫ И ПЛЕЕРА =================

async function fetchTracks(query = '') {
    try {
        const url = query ? `http://localhost:8081/api/v1/tracks?search=${query}` : 'http://localhost:8081/api/v1/tracks';
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        renderTracks(data);
    } catch (e) {
        if (trackList) trackList.innerHTML = `<p class="status-msg">${translations[currentLang].alertBackendError}</p>`;
    }
}

function renderTracks(tracks) {
    if (!trackList) return;
    trackList.innerHTML = '';
    if (!tracks || tracks.length === 0) {
        trackList.innerHTML = `<p class="status-msg">${translations[currentLang].statusSilence}</p>`;
        return;
    }

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';

        let coverName = track.coverUrl ? track.coverUrl.split('\\').pop().split('/').pop() : null;
        const coverImg = coverName ? `http://localhost:8081/media/covers/${coverName}` : 'https://via.placeholder.com/200/282828/FFFFFF?text=Music';

        let cleanTitle = track.title || 'Без названия';
        if (cleanTitle.includes(' - ')) cleanTitle = cleanTitle.split(' - ').pop();

        card.innerHTML = `
            <img src="${coverImg}" alt="cover" onerror="this.src='https://via.placeholder.com/200/282828/FFFFFF?text=No+Cover'">
            <div class="card-info" style="display: flex; flex-direction: column; gap: 4px; padding: 10px 0;">
                <strong class="track-title" style="display: block; font-size: 16px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cleanTitle}</strong>
                <span class="artist-link" style="color: #b3b3b3; font-size: 14px; cursor: pointer; display: inline-block; width: fit-content; transition: color 0.2s;">${track.artistName || 'Unknown Artist'}</span>
            </div>
        `;

        let audioName = track.audioUrl ? track.audioUrl.split('\\').pop().split('/').pop() : '';
        card.onclick = () => playTrack(audioName, cleanTitle, coverImg, track.artistName, track.artistId);

        const artistBtn = card.querySelector('.artist-link');
        if (artistBtn) {
            artistBtn.onmouseenter = () => { artistBtn.style.color = '#1db954'; artistBtn.style.textDecoration = 'underline'; };
            artistBtn.onmouseleave = () => { artistBtn.style.color = '#b3b3b3'; artistBtn.style.textDecoration = 'none'; };
            artistBtn.onclick = (event) => {
                event.stopPropagation();
                goToPublicArtistPage(track.artistId, track.artistName);
            };
        }
        trackList.appendChild(card);
    });
}

function playTrack(url, title, cover, artistName, artistId) {
    if (!url) return alert(translations[currentLang].alertNoAudio);
    if (!mainAudio) return;

    mainAudio.src = `http://localhost:8081/media/tracks/${url}`;
    mainAudio.play().catch(e => console.error("Ошибка воспроизведения:", e));

    if (currentTitle) currentTitle.innerText = title;
    if (playerCover) playerCover.src = cover;

    const playerArtistContainer = document.getElementById('currentTrackArtist');
    if (playerArtistContainer) {
        playerArtistContainer.innerHTML = `<span class="player-artist-link" style="color: #b3b3b3; cursor: pointer; font-size: 14px; transition: color 0.2s;">${artistName || 'Unknown Artist'}</span>`;
        const playerArtistLink = playerArtistContainer.querySelector('.player-artist-link');
        if (playerArtistLink) {
            playerArtistLink.onmouseenter = () => { playerArtistLink.style.color = '#1db954'; playerArtistLink.style.textDecoration = 'underline'; };
            playerArtistLink.onmouseleave = () => { playerArtistLink.style.color = '#b3b3b3'; playerArtistLink.style.textDecoration = 'none'; };
            playerArtistLink.onclick = () => goToPublicArtistPage(artistId, artistName);
        }
    }
}

// ================= ЛОГИКА ПУБЛИЧНОЙ СТРАНИЦЫ АРТИСТА =================

function goToPublicArtistPage(artistId, artistName) {
    if (!artistId) return alert(translations[currentLang].alertNoArtistProfile);

    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

    const container = document.getElementById('artist-public-page');
    if (!container) {
        alert("Критическая ошибка: Добавьте <div id='artist-public-page' class='view' style='display:none;'></div> в index.html");
        return;
    }
    container.style.display = 'block';

    const dict = translations[currentLang];

    container.innerHTML = `
        <div class="artist-header" style="padding: 24px; background: linear-gradient(transparent, #121212), #282828; margin-bottom: 20px; border-radius: 8px; position: relative;">
            <button onclick="showView('main-page')" class="btn-back-custom" style="background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 18px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s ease; backdrop-filter: blur(10px);">
                ${dict.profileBackBtn}
            </button>
            <h1 style="color: #fff; font-size: 48px; margin: 0; font-weight: 800; letter-spacing: -1px;">${artistName}</h1>
            <p style="color: #b3b3b3; margin: 5px 0 0 0; font-size: 14px;">${dict.profileSubTitle}</p>
        </div>
        <h3 style="color: #fff; margin-left: 20px; margin-bottom: 15px; font-size: 20px;">${dict.profileReleases}</h3>
        <div id="artistTrackList" class="track-grid"></div>
    `;

    const backBtn = container.querySelector('.btn-back-custom');
    if (backBtn) {
        backBtn.onmouseenter = () => { backBtn.style.borderColor = '#1db954'; backBtn.style.color = '#1db954'; backBtn.style.backgroundColor = 'rgba(29, 185, 84, 0.1)'; backBtn.style.transform = 'scale(1.03)'; };
        backBtn.onmouseleave = () => { backBtn.style.borderColor = 'rgba(255,255,255,0.1)'; backBtn.style.color = '#fff'; backBtn.style.backgroundColor = 'rgba(0,0,0,0.5)'; backBtn.style.transform = 'scale(1)'; };
    }

    fetchArtistTracks(artistId);
}

async function fetchArtistTracks(artistId) {
    const artistTrackList = document.getElementById('artistTrackList');
    if (!artistTrackList) return;
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
            const coverImg = coverName ? `http://localhost:8081/media/covers/${coverName}` : 'https://via.placeholder.com/200/282828/FFFFFF?text=Music';

            let cleanTitle = track.title || 'Без названия';
            if (cleanTitle.includes(' - ')) cleanTitle = cleanTitle.split(' - ').pop();

            card.innerHTML = `
                <img src="${coverImg}" alt="cover" onerror="this.src='https://via.placeholder.com/200/282828/FFFFFF?text=No+Cover'">
                <div class="card-info" style="display: flex; flex-direction: column; gap: 4px; padding: 10px 0;">
                    <strong class="track-title" style="display: block; font-size: 16px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cleanTitle}</strong>
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

// ================= КОНСОЛЬ ЗАГРУЗКИ ТРЕКОВ =================

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
    if (coverFile) formData.append('cover', coverFile);
    formData.append('username', currentUsername);

    try {
        const response = await fetch('http://localhost:8081/api/v1/tracks/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert(translations[currentLang].alertUploadSuccess);
            trackFileInput.value = '';
            if (coverFileInput) coverFileInput.value = '';

            const trackTxt = document.getElementById('custom-track-file-text');
            const coverTxt = document.getElementById('custom-cover-file-text');
            if (trackTxt) { trackTxt.innerText = translations[currentLang].fileNotSelected; trackTxt.style.color = '#b3b3b3'; }
            if (coverTxt) { coverTxt.innerText = translations[currentLang].fileNotSelected; coverTxt.style.color = '#b3b3b3'; }

            showView('main-page');
            fetchTracks();
        } else {
            alert("Error: " + await response.text());
        }
    } catch (e) {
        console.error(e);
        alert(translations[currentLang].alertBackendError);
    }
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => fetchTracks(e.target.value));
}

function toggleSidebar(open) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        if (open) { sidebar.classList.add('active'); overlay.classList.add('active'); }
        else { sidebar.classList.remove('active'); overlay.classList.remove('active'); }
    }
}

function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    toggleSidebar(false);
    showView('auth-page');
}

window.onload = () => {
    showView('auth-page');
    changeLanguage(currentLang);
};

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('authPassword');
    const toggleBtn = document.getElementById('togglePasswordBtn');
    if (passwordInput && toggleBtn) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = `
                <svg id="eyeIcon" viewBox="0 0 24 24" width="20" height="20" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = `
                <svg id="eyeIcon" viewBox="0 0 24 24" width="20" height="20" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    }
}