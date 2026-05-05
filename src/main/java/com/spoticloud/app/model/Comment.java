package com.spoticloud.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    // Кто оставил комментарий (связь с твоей сущностью User)
    // Если сущность называется иначе, поправь имя класса
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;
    @Column(name = "track_id", nullable = false)
    private UUID trackId;
    // К какому профилю артиста относится комментарий
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_profile_id")
    private ArtistProfile artistProfile;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}