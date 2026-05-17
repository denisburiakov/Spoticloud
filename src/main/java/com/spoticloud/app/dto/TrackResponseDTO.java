package com.spoticloud.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrackResponseDTO {
    private UUID id;
    private String title;
    private UUID artistId;
    private String audioUrl; // Было audioPath
    private String coverUrl; // Было coverPath

    private String artistName;
}