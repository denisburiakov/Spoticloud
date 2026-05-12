package com.spoticloud.app.repository;

import com.spoticloud.app.model.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrackRepository extends JpaRepository<Track, UUID> {
    List<Track> findByArtistId(UUID artist_id);
    List<Track> findByTitleContainingIgnoreCase(String title);
    boolean existsByAudioUrl(String audioUrl);
}