package com.spoticloud.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    @Value("${storage.location}")
    private String storageLocation;

    public String saveFile(MultipartFile file) throws IOException {

        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".mp3")) {
            throw new IllegalArgumentException("Only .mp3 files are allowed");
        }

        Path root = Paths.get(storageLocation);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = UUID.randomUUID() + ".mp3";
        Files.copy(file.getInputStream(), root.resolve(filename));
        return filename;
    }
}