package com.spoticloud.app.controller;

import com.spoticloud.app.dto.TrackResponseDTO;
import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.model.User;
import com.spoticloud.app.model.UserRole;
import com.spoticloud.app.repository.ArtistProfileRepository;
import com.spoticloud.app.repository.TrackRepository;
import com.spoticloud.app.repository.UserRepository;
import com.spoticloud.app.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tracks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrackController {

    private final TrackService trackService;
    private final TrackRepository trackRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadTrack(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "cover", required = false) MultipartFile cover,
            @RequestParam("username") String username
    ) {
        try {
            // 1. Ищем юзера
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Юзер не найден"));

            // 2. Проверка на артиста
            if (user.getRole() != UserRole.ROLE_ARTIST) {
                return ResponseEntity.status(403).body("Ты не артист, бро!");
            }

            // 3. Ищем профиль артиста этого юзера
            ArtistProfile artistProfile = artistProfileRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Сначала создай профиль артиста!"));

            // 4. Отрезаем расширение файла (.mp3, .wav), чтобы в названии трека была только красота
            String originalFilename = file.getOriginalFilename();
            String title = originalFilename;
            if (originalFilename != null && originalFilename.contains(".")) {
                title = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            }

            // 5. Передаем чистое название в сервис для сохранения в базу
            Track savedTrack = trackService.createTrack(title, file, cover, artistProfile.getId());

            return ResponseEntity.ok("Трек '" + title + "' успешно загружен артистом: " + artistProfile.getName());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка загрузки: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getTracks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID artistId
    ) {
        try {
            List<Track> tracks;
            if (search != null && !search.isBlank()) {
                tracks = trackService.searchTracks(search);
            } else if (artistId != null) {
                tracks = trackService.getTracksByArtist(artistId);
            } else {
                tracks = trackService.getAllTracks();
            }

            if (tracks == null) return ResponseEntity.ok(new java.util.ArrayList<>());

            // Превращаем в DTO и добавляем artistId для будущих переходов на фронте
            List<TrackResponseDTO> response = tracks.stream()
                    .map(t -> {
                        TrackResponseDTO dto = new TrackResponseDTO();
                        dto.setId(t.getId());
                        dto.setTitle(t.getTitle());
                        dto.setAudioUrl(t.getAudioUrl());
                        dto.setCoverUrl(t.getCoverUrl());

                        if (t.getArtist() != null) {
                            dto.setArtistName(t.getArtist().getName());
                            dto.setArtistId(t.getArtist().getId()); // Передаем ID для генерации ссылок на фронте
                        } else {
                            dto.setArtistName("Unknown");
                            dto.setArtistId(null);
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении треков");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable UUID id) {
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }
}