package com.spoticloud.app.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserProfileDTO {
    private UUID userId;
    private String username;
    private String bio;
    private String avatarUrl;
}