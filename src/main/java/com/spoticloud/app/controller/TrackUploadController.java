package com.spoticloud.app.controller;

import com.spoticloud.app.repository.TrackRepository;
import com.spoticloud.app.model.Track;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.File;


@RestController
@RequestMapping("/api/v1/tracks")
public class TrackUploadController {

    private final TrackRepository trackRepository;
    // Путь к твоей папке
    private final String uploadDir = "C:/spcl_uploads/spoticloud_media/";

    public TrackUploadController(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTrack(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().body("Файл пуст!");

            String fileName = file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);


            file.transferTo(dest);


            if (!trackRepository.existsByAudioUrl(fileName)) {
                Track track = new Track();
                track.setTitle(title);
                track.setAudioUrl(fileName);
                trackRepository.save(track);
            }

            return ResponseEntity.ok("Файл успешно загружен: " + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Ошибка при сохранении: " + e.getMessage());
        }
    }
}
