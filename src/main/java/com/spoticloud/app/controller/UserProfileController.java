package com.spoticloud.app.controller;

import com.spoticloud.app.dto.UserProfileDTO;
import com.spoticloud.app.model.User;
import com.spoticloud.app.model.UserProfile;
import com.spoticloud.app.repository.UserRepository;
import com.spoticloud.app.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // ПУТЬ ДОЛЖЕН СОВПАДАТЬ С ПАПКОЙ В СИСТЕМЕ
    private final String uploadFolder = "C:/spoticloud_uploads/avatars/";

    @PostMapping("/profile/update")
    @Transactional // Обязательно для сохранения изменений в БД
    public ResponseEntity<?> updateProfile(
            @RequestParam("username") String username,
            @RequestParam("bio") String bio,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Юзер не найден"));

            UserProfile profile = userProfileRepository.findByUser(user)
                    .orElse(UserProfile.builder().user(user).build());

            profile.setBio(bio);

            if (avatar != null && !avatar.isEmpty()) {
                String avatarUrl = saveFile(avatar, "avatar_" + username);
                profile.setAvatarUrl(avatarUrl);
            }

            userProfileRepository.save(profile);
            return ResponseEntity.ok(Map.of("message", "Профиль обновлен", "avatarUrl", profile.getAvatarUrl()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ошибка сервера: " + e.getMessage()));
        }
    }

    // МЕТОД СОХРАНЕНИЯ (как у артиста, чтобы не было ошибок)
    private String saveFile(MultipartFile file, String prefix) throws IOException {
        File folder = new File(uploadFolder);
        if (!folder.exists()) {
            folder.mkdirs(); // Создаст папку, если её нет
        }

        String fileName = prefix + "_" + UUID.randomUUID().toString().substring(0, 8) + ".jpg";
        File destination = new File(folder.getAbsolutePath() + File.separator + fileName);
        file.transferTo(destination);

        return "/media/avatars/" + fileName; // Убедись, что это путь, который понимает твой статик-ресурс
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Юзер не найден"));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElse(UserProfile.builder().user(user).bio("").avatarUrl("").build());

        return ResponseEntity.ok(UserProfileDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .build());
    }
}