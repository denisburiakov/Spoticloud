package com.spoticloud.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "tracks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"tracks", "hibernateLazyInitializer", "handler"})

public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(name = "audio_url", nullable = false, unique = true)
    private String audioUrl;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(name = "album_id")
    private UUID albumId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id", nullable = true)
    private ArtistProfile artist;

}