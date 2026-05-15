package com.spoticloud.app.controller;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.repository.ArtistProfileRepository;
import com.spoticloud.app.repository.TrackRepository;
import com.spoticloud.app.model.Track;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracks")
@CrossOrigin(origins = "*") // Чтобы фронт не ругался на CORS
public class TrackUploadController {

    private final TrackRepository trackRepository;
    private final ArtistProfileRepository artistProfileRepository;

    // Убедись, что эти папки реально созданы на диске C!
    private final String audioDir = "C:/spcl_uploads/spoticloud_media/";
    private final String coverDir = "C:/spcl_uploads/spoticloud_covers/";

    public TrackUploadController(TrackRepository trackRepository, ArtistProfileRepository artistProfileRepository) {
        this.trackRepository = trackRepository;
        this.artistProfileRepository = artistProfileRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTrack(
            @RequestParam("file") MultipartFile audioFile,
            @RequestParam(value = "cover", required = false) MultipartFile coverFile) {
        try {
            String originalFileName = audioFile.getOriginalFilename();

            if (originalFileName == null || !originalFileName.contains("-")) {
                return ResponseEntity.badRequest().body("Ошибка: файл должен называться 'Артист - Название.mp3'");
            }

            // 1. Парсим название: "Deftones - Change.mp3" -> "Deftones" и "Change"
            String cleanName = originalFileName.replace(".mp3", "").trim();
            String[] parts = cleanName.split("-", 2);

            String artistName = parts[0].trim();
            String trackTitle = parts[1].trim();

            // 2. Работаем с артистом
            ArtistProfile artist = artistProfileRepository.findByName(artistName)
                    .orElseGet(() -> {
                        ArtistProfile newProfile = ArtistProfile.builder()
                                .name(artistName)
                                .userId(UUID.randomUUID())
                                .verified(false)
                                .build();
                        return artistProfileRepository.save(newProfile);
                    });

            // 3. Сохраняем аудиофайл
            File destAudio = new File(audioDir + originalFileName);
            audioFile.transferTo(destAudio);

            // 4. Работаем с обложкой (если нет — ставим заглушку)
            String coverName = "default.png";
            if (coverFile != null && !coverFile.isEmpty()) {
                coverName = coverFile.getOriginalFilename();
                coverFile.transferTo(new File(coverDir + coverName));
            }

            // 5. Сохраняем трек в базу
            Track track = new Track();
            track.setTitle(trackTitle); // Сохраняем ЧИСТОЕ название без артиста
            track.setAudioUrl(originalFileName);
            track.setCoverUrl(coverName);
            track.setArtist(artist);

            trackRepository.save(track);

            return ResponseEntity.ok("Готово! Артист: " + artistName + ", Трек: " + trackTitle);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }
}