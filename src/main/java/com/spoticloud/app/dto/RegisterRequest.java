package com.spoticloud.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    // Вот оно, наше сокровище!
    private Boolean isArtist;
    private String artistName;



}