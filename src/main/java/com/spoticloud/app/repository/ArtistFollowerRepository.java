package com.spoticloud.app.repository;

import com.spoticloud.app.model.ArtistFollower;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ArtistFollowerRepository extends JpaRepository<ArtistFollower, UUID> {
    long countByArtistId(UUID artistId);
    boolean existsByArtistIdAndUsername(UUID artistId, String username);
    void deleteByArtistIdAndUsername(UUID artistId, String username);
}