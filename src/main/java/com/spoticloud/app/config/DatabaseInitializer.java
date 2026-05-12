package com.spoticloud.app.config;

import com.spoticloud.app.model.Track;
import com.spoticloud.app.repository.TrackRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.File;
import java.util.UUID;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(TrackRepository trackRepository) {
        return args -> {

            File folder = new File("C:/spcl_uploads/spoticloud_media");

            if (folder.exists() && folder.isDirectory()) {
                File[] files = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".mp3"));

                if (files != null) {
                    for (File file : files) {
                        String fileName = file.getName();
                        boolean alreadyExists = trackRepository.existsByAudioUrl(fileName);

                        if (!trackRepository.existsByAudioUrl("tracks/" + fileName) && !alreadyExists) {

                            Track newTrack = new Track();
                            newTrack.setTitle(fileName.replace(".mp3", ""));
                            newTrack.setAudioUrl(fileName);

                            trackRepository.save(newTrack);
                            System.out.println("--- Автоматически добавлен трек: " + fileName);
                        }
                        else {
                            System.out.println("--- Уже есть в базе: " + fileName);
                        }
                    }
                }
            }
        };
    }
}
