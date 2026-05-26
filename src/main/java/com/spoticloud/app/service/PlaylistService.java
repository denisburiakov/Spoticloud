package com.spoticloud.app.service;

import com.spoticloud.app.dto.PlaylistDTO;
import com.spoticloud.app.model.Playlist;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.model.User;
import com.spoticloud.app.repository.PlaylistRepository;
import com.spoticloud.app.repository.TrackRepository;
import com.spoticloud.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;

    public Playlist createPlaylist(UUID userId, String title, MultipartFile coverImage) throws IOException {

        User owner = userRepository.findById(userId).orElseThrow();

        String coverUrl = null;

        if (coverImage != null && !coverImage.isEmpty()) {

            String original = coverImage.getOriginalFilename();
            String ext = original.substring(original.lastIndexOf("."));

            String fileName = UUID.randomUUID() + ext;

            Path path = Paths.get("C:/spcl_uploads/spoticloud_covers/" + fileName);

            Files.copy(coverImage.getInputStream(), path);

            coverUrl = "/media/covers/" + fileName;
        }

        Playlist playlist = Playlist.builder()
                .title(title)
                .owner(owner)
                .coverImageUrl(coverUrl)
                .tracks(new ArrayList<>())
                .build();

        return playlistRepository.save(playlist);
    }

    @Transactional
    public void addTrackToPlaylist(UUID playlistId, UUID trackId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Плейлист не найден"));
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Трек не найден"));

        // Добавляем трек в коллекцию
        playlist.getTracks().add(track);

        // Сохраняем (Hibernate при завершении метода сам сделает INSERT в таблицу playlist_tracks)
        playlistRepository.save(playlist);
    }

    public List<Playlist> findByOwnerId(UUID userId) {
        return playlistRepository.findByOwnerId(userId);
    }

    public PlaylistDTO getPlaylistDTOById(UUID playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Плейлист не найден"));

        List<PlaylistDTO.TrackInfo> trackInfos = playlist.getTracks().stream()
                .map(track -> new PlaylistDTO.TrackInfo(
                        track.getId(),
                        track.getTitle(),
                        track.getAudioUrl(), // <-- Теперь это поле берется из сущности Track
                        track.getArtist() != null ? track.getArtist().getName() : "Unknown"
                ))
                .collect(java.util.stream.Collectors.toList());

        return PlaylistDTO.builder()
                .id(playlist.getId())
                .title(playlist.getTitle())
                .coverImageUrl(playlist.getCoverImageUrl())
                .tracks(trackInfos)
                .build();
    }

    public Playlist getPlaylistById(UUID playlistId) {
        // Если id не найден, вернем null или прокинем исключение, которое понимает твой проект
        return playlistRepository.findById(playlistId).orElse(null);
    }

}
