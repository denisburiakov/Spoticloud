package com.spoticloud.app.controller;

import com.spoticloud.app.dto.LoginRequest;
import com.spoticloud.app.dto.RegisterRequest;
import com.spoticloud.app.repository.UserRepository;
import com.spoticloud.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Добавили импорт
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Внедряем энкодер для проверки паролей

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok("Всё четко! Ты в системе.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("username", user.getUsername());
                        response.put("role", user.getRole().toString().toUpperCase());
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(401).body("Неверный пароль");
                })
                .orElse(ResponseEntity.status(404).body("Юзер не найден"));
    }
}