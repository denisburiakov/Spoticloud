package com.spoticloud.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "artist_listeners", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"artist_id", "user_id"}) // Один юзер = один уникальный слушатель для артиста
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistListener {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "artist_id", nullable = false)
    private UUID artistId; // ID профиля артиста

    @Column(name = "user_id", nullable = false)
    private UUID userId; // ID юзера, который послушал
}