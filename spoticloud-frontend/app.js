const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTrackTitle');

// Получение списка треков
async function fetchTracks(query = '') {
    try {
        const url = query
            ? `http://localhost:8081/api/v1/tracks?search=${query}`
            : 'http://localhost:8081/api/v1/tracks';

        const response = await fetch(url);
        const tracks = await response.json();
        renderTracks(tracks);
    } catch (error) {
        console.error("Fetch error:", error);
        trackList.innerHTML = `<p class="error">Ошибка: проверь, запущен ли бэкенд!</p>`;
    }
}

// Загрузка файла (теперь только файл и обложка)
async function uploadFile() {
    const audio = document.getElementById('trackFile').files[0];
    const cover = document.getElementById('coverFile').files[0];

    if (!audio) {
        alert("Сначала выбери аудиофайл!");
        return;
    }

    const formData = new FormData();
    // Отправляем только файл. Бэкенд сам вытащит артиста и название из имени файла.
    formData.append("file", audio);

    if (cover) {
        formData.append("cover", cover);
    }

    try {
        const response = await fetch('http://localhost:8081/api/v1/tracks/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.text();
            alert(result); // Покажет "Готово! Артист: ..., Трек: ..."
            fetchTracks();
        } else {
            const errorMsg = await response.text();
            alert("Ошибка: " + errorMsg);
        }
    } catch (e) {
        alert("Критическая ошибка при загрузке!");
        console.error(e);
    }
}
function showArtistProfile(id) {
    alert("Переходим к артисту с ID: " + id);
    // Тут потом сделаешь fetch данных конкретного артиста или смену экрана
}
// Отрисовка треков в интерфейсе
function renderTracks(tracks) {
    trackList.innerHTML = '';

    if (!tracks || tracks.length === 0) {
        trackList.innerHTML = '<p>Ничего не найдено :(</p>';
        return;
    }

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';

        // Безопасно достаем данные артиста
        const artistName = (track.artist && track.artist.name) ? track.artist.name : 'Неизвестен';
        const artistId = (track.artist && track.artist.id) ? track.artist.id : null;
        const coverImg = track.coverUrl ? track.coverUrl : 'default.png';

        card.innerHTML = `
            <img src="http://localhost:8081/media/covers/${coverImg}"
                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            <div class="info">
                <strong>${track.title}</strong>
                <p class="artist-link" style="color: #1db954; cursor: pointer; margin: 0; font-size: 0.9em;">
                    ${artistName}
                </p>
            </div>
            <button class="play-btn">Play</button>
        `;

        // Обработка клика по артисту (если функция showArtistProfile реализована)
        const link = card.querySelector('.artist-link');
        if (artistId && typeof showArtistProfile === 'function') {
            link.onclick = () => showArtistProfile(artistId);
        }

        // Логика плеера
        card.querySelector('.play-btn').onclick = () => {
            const backendUrl = 'http://localhost:8081';
            // Чистим путь к файлу
            const fileName = track.audioUrl.startsWith('/') ? track.audioUrl.substring(1) : track.audioUrl;

            mainAudio.src = `${backendUrl}/media/tracks/${fileName}`;
            console.log("Запрос к файлу:", mainAudio.src);

            mainAudio.play().catch(e => {
                alert("Не удалось воспроизвести файл. Проверь папку на сервере.");
                console.error("Playback error:", e);
            });

            currentTitle.innerText = `Играет: ${track.title} — ${artistName}`;
        };

        trackList.appendChild(card);
    });
}

// Поиск в реальном времени
searchInput.addEventListener('input', (e) => {
    fetchTracks(e.target.value);
});

// Запуск при загрузке страницы
fetchTracks();