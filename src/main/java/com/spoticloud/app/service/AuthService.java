package com.spoticloud.app.service;

import com.spoticloud.app.dto.RegisterRequest;
import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.User;
import com.spoticloud.app.model.UserRole;
import com.spoticloud.app.repository.ArtistProfileRepository;
import com.spoticloud.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        // ЛОГ для отладки
        System.out.println("DEBUG: Регистрация юзера: " + request.getUsername());
        System.out.println("DEBUG: Флаг артиста: " + request.getIsArtist());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Братан, такой логин уже занят!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Проверяем флаг
        boolean isArtist = request.getIsArtist() != null && request.getIsArtist();

        // Ставим роль
        user.setRole(isArtist ? UserRole.ROLE_ARTIST : UserRole.ROLE_LISTENER);

        User savedUser = userRepository.save(user);

        if (isArtist) {
            String finalArtistName = (request.getArtistName() != null && !request.getArtistName().isBlank())
                    ? request.getArtistName()
                    : request.getUsername();

            ArtistProfile profile = ArtistProfile.builder()
                    .name(finalArtistName)
                    .user(savedUser)
                    .verified(false)
                    .build();
            artistProfileRepository.save(profile);
            System.out.println("DEBUG: Профиль артиста создан!");
        }
    }
}