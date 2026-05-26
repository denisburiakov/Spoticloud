package com.spoticloud.app.controller;

import com.spoticloud.app.dto.PlaylistDTO;
import com.spoticloud.app.dto.TrackResponseDTO;
import com.spoticloud.app.model.Playlist;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.service.ArtistProfileService;
import com.spoticloud.app.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/playlists")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;


    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Playlist> create(
            @RequestParam UUID userId,
            @RequestParam String title,
            @RequestPart(required = false) MultipartFile cover) throws IOException {
        return ResponseEntity.ok(playlistService.createPlaylist(userId, title, cover));
    }

    @PostMapping("/{playlistId}/add-track")
    public ResponseEntity<String> addTrack(@PathVariable UUID playlistId, @RequestParam UUID trackId) {
        playlistService.addTrackToPlaylist(playlistId, trackId);
        return ResponseEntity.ok("Track added!");
    }

    @GetMapping("/my")
    public ResponseEntity<List<PlaylistDTO>> getMyPlaylists(@RequestParam UUID userId) {
        return ResponseEntity.ok(playlistService.findByOwnerId(userId).stream()
                .map(p -> PlaylistDTO.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .coverImageUrl(p.getCoverImageUrl())
                        .build())
                .collect(Collectors.toList()));
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDTO> getPlaylist(@PathVariable UUID playlistId) {
        return ResponseEntity.ok(playlistService.getPlaylistDTOById(playlistId));
    }
}
