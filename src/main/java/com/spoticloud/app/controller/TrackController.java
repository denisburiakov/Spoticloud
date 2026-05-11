package com.spoticloud.app.controller;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.service.ArtistProfileService;
import com.spoticloud.app.service.FileService;
import com.spoticloud.app.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;
    private final FileService fileService;
    private final ArtistProfileService artistProfileService;
    @GetMapping
    public ResponseEntity<List<Track>> getAllTracks() {
        return ResponseEntity.ok(trackService.getAllTracks());
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Track>> getTracksByArtist(@PathVariable UUID artistId) {
        List<Track> tracks = trackService.getTracksByArtist(artistId);
        return ResponseEntity.ok(tracks);
    }

    @PostMapping
    public ResponseEntity<Track> createTrack(@RequestBody Track track) {
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

        // Вызываем сервис, который сохранит картинку и обновит поле coverUrl в базе
        Track updatedTrack = trackService.updateTrackCover(trackId, file);

        return ResponseEntity.ok(updatedTrack);
    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Track createTrack(
            @RequestParam("file") MultipartFile audioFile,
            @RequestParam("cover") MultipartFile coverFile, // Добавляем это поле
            @RequestParam("title") String title,
            @RequestParam("artistId") UUID artistId
    ) {
        return trackService.createTrack(title, audioFile, coverFile, artistId);
    }
}