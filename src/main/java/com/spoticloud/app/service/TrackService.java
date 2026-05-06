package com.spoticloud.app.service;

import com.spoticloud.app.model.Track;
import com.spoticloud.app.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;

    @Transactional(readOnly = true)
    public List<Track> getAllTracks() {
        return trackRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Track> getTracksByArtist(UUID artistId) {
        return trackRepository.findByArtistId(artistId);
    }

    @Transactional
    public Track createTrack(Track track) {
        return trackRepository.save(track);
    }

    @Transactional
    public void deleteTrack(UUID id) {
        if (!trackRepository.existsById(id)) {
            throw new RuntimeException("Track not found with id: " + id);
        }
        trackRepository.deleteById(id);
    }
}