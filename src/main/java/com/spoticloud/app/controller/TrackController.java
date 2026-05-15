package com.spoticloud.app.controller;

import com.spoticloud.app.dto.TrackResponseDTO;
import com.spoticloud.app.mapper.TrackMapper;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.service.ArtistProfileService;
import com.spoticloud.app.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackMapper trackMapper;
    private final TrackService trackService;
    private final ArtistProfileService artistProfileService;

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Track>> getTracksByArtist(@PathVariable UUID artistId) {
        List<Track> tracks = trackService.getTracksByArtist(artistId);
        return ResponseEntity.ok(tracks);
    }

    // ВАРИАНТ 1: Оставляем для JSON запросов (если нужно)
    @PostMapping("/simple")
    public ResponseEntity<Track> createTrackSimple(@RequestBody Track track) {
        Track savedTrack = trackService.createTrack(track);
        return new ResponseEntity<>(savedTrack, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable UUID id) {
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{trackId}/spoticloud_cover")
    public ResponseEntity<Track> uploadCover(
            @PathVariable UUID trackId,
            @RequestParam("file") MultipartFile file) {
        Track updatedTrack = trackService.updateTrackCover(trackId, file);
        return ResponseEntity.ok(updatedTrack);
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Track uploadTrackWithFiles(
            @RequestParam("file") MultipartFile audioFile,
            @RequestParam("cover") MultipartFile coverFile,
            @RequestParam("title") String title,
            @RequestParam("artistId") UUID artistId
    ) {
        return trackService.createTrack(title, audioFile, coverFile, artistId);
    }

    @GetMapping
    public ResponseEntity<?> getTracks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID artistId
    ) {
        try {
            List<Track> tracks;
            if (search != null) {
                tracks = trackService.searchTracks(search);
            } else if (artistId != null) {
                tracks = trackService.getTracksByArtist(artistId);
            } else {
                tracks = trackService.getAllTracks();
            }

            // Если даже тут падает, значит проблема в trackService.getAllTracks()
            if (tracks == null) return ResponseEntity.ok(new java.util.ArrayList<>());

            List<TrackResponseDTO> response = tracks.stream()
                    .map(t -> {
                        TrackResponseDTO dto = new TrackResponseDTO();
                        dto.setId(t.getId());
                        dto.setTitle(t.getTitle() != null ? t.getTitle() : "Unknown");
                        dto.setAudioUrl(t.getAudioUrl());
                        dto.setCoverUrl(t.getCoverUrl());
                        // Заглушка для ID артиста, чтобы не лезть в связи
                        dto.setArtistId(null);
                        return dto;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Это ВАЖНО: выведет ошибку в консоль IDEA
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка на бэке: " + e.getMessage());
        }
    }
}