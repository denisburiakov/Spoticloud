package com.spoticloud.app.mapper;

import com.spoticloud.app.dto.TrackResponseDTO;
import com.spoticloud.app.model.Track;
import org.springframework.stereotype.Component;

@Component
public class TrackMapper {


    private final String BASE_URL = "http://localhost:8081";

    public TrackResponseDTO toDTO(Track track) {

        return TrackResponseDTO.builder()
                .id(track.getId())
                .title(track.getTitle())

                .artistId(track.getArtist() != null ? track.getArtist().getId() : null)

                .audioUrl(BASE_URL + track.getAudioUrl())
                .coverUrl(track.getCoverUrl() != null ? BASE_URL + track.getCoverUrl() : null)
                .build();
    }
}