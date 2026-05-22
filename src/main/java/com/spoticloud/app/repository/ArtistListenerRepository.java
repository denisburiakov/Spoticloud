package com.spoticloud.app.repository;

import com.spoticloud.app.model.ArtistListener;
import org.springframework.data.jpa.repository.JpaRepository;
import tools.jackson.databind.deser.jdk.UUIDDeserializer;

import java.util.UUID;

public interface ArtistListenerRepository extends JpaRepository<ArtistListener, UUID> {
    // Метод посчитает количество уникальных записей для конкретного артиста
    long countByArtistId(UUID artistId);

    // Проверка, слушал ли уже этот юзер этого артиста
    boolean existsByArtistIdAndUserId(UUID artistId, UUID userId);
}