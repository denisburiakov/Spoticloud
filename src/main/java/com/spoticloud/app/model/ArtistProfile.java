package com.spoticloud.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "artist_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true) // unique=true гарантирует, что у одного юзера только ОДИН профиль
    private User user;

    @Column(nullable = false)
    private String name; // Сценическое имя (заполняется при регистрации или редактировании)

    @Column(columnDefinition = "TEXT")
    private String bio;

    // НОВОЕ ПОЛЕ: Ежемесячные слушатели (то, что просил фронтенд)
    @Column(name = "monthly_listeners")
    private Integer monthlyListeners = 0;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl; // Твой аватар на фронте

    @Column(name = "header_image_url")
    private String headerImageUrl; // Твой баннер (задний фон) на фронте

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "social_links")
    private String socialLinks; // Привели к camelCase для код-стайла Java

    private String country;

    @Column(name = "is_verified")
    private boolean verified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}