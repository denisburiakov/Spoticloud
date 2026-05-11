package com.spoticloud.app.service;

import com.spoticloud.app.model.User;
import com.spoticloud.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Это бин из SecurityConfig

    public void registerUser(User user) {
        // 1. Шифруем пароль (без этого Security не пустит)
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // 2. Сохраняем в базу
        userRepository.save(user);
    }
}