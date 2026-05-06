package com.spoticloud.app.service;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.repository.ArtistProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistProfileService {

    private final ArtistProfileRepository repository;

    public ArtistProfile findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Профиль артиста не найден!"));
    }
}
