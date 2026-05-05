package com.spoticloud.app.model;
import jakarta.persistence.*;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "User_Likes")
public class UserLikes {
    @EmbeddedId
    private UserLikeId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("trackId")
    @JoinColumn(name = "track_id")
    private Track track;

    @CreationTimestamp
    private OffsetDateTime createdAt;
}

@Embeddable
@Data
class UserLikeId implements Serializable {
    private UUID userId;
    private UUID trackId;
}
