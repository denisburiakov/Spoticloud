package com.spoticloud.app.model;
import jakarta.persistence.*;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "Playlist_Tracks")
public class PlaylistTracks {

    @EmbeddedId
    private PlaylistTrackId id;

    @ManyToOne
    @MapsId("playlistId")
    @JoinColumn(name = "playlist_id")
    private Playlist playlist;

    @ManyToOne
    @MapsId("trackId")
    @JoinColumn(name = "track_id")
    private Track track;

    @CreationTimestamp
    private OffsetDateTime addedAt;
}

@Embeddable
@Data
class PlaylistTrackId implements Serializable {
    private UUID playlistId;
    private UUID trackId;
}
