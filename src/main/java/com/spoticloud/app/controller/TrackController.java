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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Track> uploadTrack(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("artistId") UUID artistId) throws IOException {


        String fileName = fileService.saveFile(file);

        ArtistProfile profile = artistProfileService.findById(artistId);
        Track track = new Track();
        track.setArtist(profile);
        track.setTitle(title);
        track.setArtist(profile);
        track.setAudioUrl("/media/" + fileName);

        return ResponseEntity.ok(trackService.save(track));
    }
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
}