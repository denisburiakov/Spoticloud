const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTrackTitle');


async function fetchTracks(query = '') {
    try {
        const url = query
            ? `http://127.0.0.1:8081/api/v1/tracks?search=${query}`
            : 'http://127.0.0.1:8081/api/v1/tracks';

        const response = await fetch(url);
        const tracks = await response.json();
        renderTracks(tracks);
    } catch (error) {
        trackList.innerHTML = `<p class="error">Ошибка: проверь, запущен ли бэкенд!</p>`;
    }
}
async function uploadFile() {
    const titleInput = document.getElementById('trackTitle');
    const fileInput = document.getElementById('trackFile');
    const status = document.getElementById('uploadStatus');

    if (!fileInput.files[0] || !titleInput.value) {
        alert("Заполни название и выбери файл!");
        return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("file", fileInput.files[0]);

    status.innerText = "Загрузка...";

    try {
        const response = await fetch('http://localhost:8081/api/v1/tracks/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            status.innerText = "Успешно загружено!";
            titleInput.value = '';
            fileInput.value = '';
            fetchTracks(); // Обновляем список треков на странице
        } else {
            status.innerText = "Ошибка при загрузке.";
        }
    } catch (error) {
        console.error("Ошибка:", error);
        status.innerText = "Бэкенд не ответил.";
    }
}

function renderTracks(tracks) {
    trackList.innerHTML = '';
    if (tracks.length === 0) {
        trackList.innerHTML = '<p>Ничего не найдено :(</p>';
        return;
    }

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
            <div class="info">
                <strong>${track.title}</strong>
                <span>ID артиста: ${track.artistId ? track.artistId.substring(0, 8) : 'Неизвестен'}</span>
            </div>
            <button class="play-btn">Play</button>
        `;


        card.querySelector('.play-btn').onclick = () => {
            const backendUrl = 'http://localhost:8081';

            const fileName = track.audioUrl.startsWith('/') ? track.audioUrl.substring(1) : track.audioUrl;

            mainAudio.src = `${backendUrl}/media/tracks/${fileName}`;

            console.log("Пытаюсь включить:", mainAudio.src);

            mainAudio.play().catch(e => {
                alert("Файл не найден! Проверь, что в базе имя совпадает с файлом в папке.");
                console.error("Ошибка:", e);
            });

            currentTitle.innerText = `Играет: ${track.title}`;
        };

        trackList.appendChild(card);
    });
}


searchInput.addEventListener('input', (e) => {
    fetchTracks(e.target.value);
});

// Первая загрузка
fetchTracks();