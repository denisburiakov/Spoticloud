package com.spoticloud.app.repository;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArtistProfileRepository extends JpaRepository<ArtistProfile, UUID> {
    Optional<ArtistProfile> findByName(String name);
    Optional<ArtistProfile> findByUser(User user);
}