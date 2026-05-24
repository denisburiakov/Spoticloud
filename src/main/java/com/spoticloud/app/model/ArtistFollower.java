package com.spoticloud.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "artist_followers", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"artist_id", "username"}) // Юзер не может подписаться дважды
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistFollower {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "artist_id", nullable = false)
    private UUID artistId; // На кого подписались

    @Column(name = "username", nullable = false)
    private String username; // Кто подписался

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
