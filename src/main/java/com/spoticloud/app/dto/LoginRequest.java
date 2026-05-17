package com.spoticloud.app.dto; // проверь свой пакет!

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}