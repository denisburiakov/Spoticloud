package com.spoticloud.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistDTO {
    private UUID id;
    private String title;
    private String coverImageUrl;
    // Добавляем список треков сюда
    private List<TrackInfo> tracks;

    // Вложенный класс для информации о треке (чтобы не тянуть весь Entity Track)
    @Data
    @AllArgsConstructor
    public static class TrackInfo {
        private UUID id;
        private String title;
        private String audioUrl;
        private String artistName;
    }
}