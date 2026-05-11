package com.spoticloud.app.service;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.Track;
import com.spoticloud.app.repository.ArtistProfileRepository;
import com.spoticloud.app.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackService {
    private final ArtistProfileRepository artistRepository;
    private final TrackRepository trackRepository;

    @Transactional(readOnly = true)
    public List<Track> getAllTracks() {
        return trackRepository.findAll();
    }
    public Track save(Track track) {
        return trackRepository.save(track);
    }
    @Transactional(readOnly = true)
    public List<Track> getTracksByArtist(UUID artistId) {
        return trackRepository.findByArtistId(artistId);
    }

    @Transactional
    public Track createTrack(Track track) {
        return trackRepository.save(track);
    }

    @Transactional
    public void deleteTrack(UUID id) {
        if (!trackRepository.existsById(id)) {
            throw new RuntimeException("Track not found with id: " + id);
        }
        trackRepository.deleteById(id);
    }

    public Track updateTrackCover(UUID trackId, MultipartFile file) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Трек не найден!"));

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = Paths.get("C:/spcl_uploads/spoticloud_covers/" + fileName);

        try {
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении обложки", e);
        }

        track.setCoverUrl("/media/covers/" + fileName);
        System.out.println("DEBUG: Сохраняем путь в базу: " + track.getCoverUrl()); // Посмотри, что выведет в консоль
        return trackRepository.save(track);
    }
    public Track createTrack(String title, MultipartFile audioFile, MultipartFile coverFile, UUID artistId) {

        ArtistProfile artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Артист не найден"));


        String audioName = UUID.randomUUID() + "_" + audioFile.getOriginalFilename();
        String coverName = UUID.randomUUID() + "_" + coverFile.getOriginalFilename();


        saveFile(audioFile, "C:/spcl_uploads/spoticloud_media/" + audioName);


        saveFile(coverFile, "C:/spcl_uploads/spoticloud_covers/" + coverName);

        // 5. Создаем объект трека и заполняем его
        Track track = new Track();
        track.setTitle(title);
        track.setArtist(artist);
        track.setAudioUrl("/media/tracks/" + audioName);
        track.setCoverUrl("/media/covers/" + coverName); // Вот теперь она не будет null!

        return trackRepository.save(track);
    }

    // Вспомогательный метод, чтобы не дублировать код сохранения
    private void saveFile(MultipartFile file, String fullPath) {
        try {
            Path path = Paths.get(fullPath);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении файла: " + fullPath, e);
        }
    }
}