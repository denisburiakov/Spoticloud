package com.spoticloud.app.controller;

import com.spoticloud.app.model.ArtistProfile;
import com.spoticloud.app.model.User;
import com.spoticloud.app.repository.ArtistProfileRepository;
import com.spoticloud.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artist/profile")
@CrossOrigin(origins = "*")
public class ArtistProfileController {

    private final ArtistProfileRepository artistProfileRepository;
    private final UserRepository userRepository;

    // ЖЕСТКИЙ ФИКС ПУТИ: Направляем контроллер прямо в папку на диске C:
    private final String uploadFolder = "C:/spcl_uploads/spoticloud_artists/";

    public ArtistProfileController(ArtistProfileRepository artistProfileRepository, UserRepository userRepository) {
        this.artistProfileRepository = artistProfileRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam String username) {
        try {
            return artistProfileRepository.findByUserUsername(username)
                    .map(profile -> {
                        Map<String, Object> responseMap = new HashMap<>();
                        responseMap.put("id", profile.getId());
                        responseMap.put("name", profile.getName());
                        responseMap.put("bio", profile.getBio() != null ? profile.getBio() : "");
                        responseMap.put("listeners", profile.getMonthlyListeners() != null ? profile.getMonthlyListeners() : 0);
                        responseMap.put("avatarUrl", profile.getProfilePictureUrl() != null ? profile.getProfilePictureUrl() : "");
                        responseMap.put("backgroundUrl", profile.getHeaderImageUrl() != null ? profile.getHeaderImageUrl() : "");
                        return ResponseEntity.ok(responseMap);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ошибка на бэкенде: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> saveOrUpdateProfile(
            @RequestParam("username") String username,
            @RequestParam("listeners") Integer listeners,
            @RequestParam("bio") String bio,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "background", required = false) MultipartFile background) {

        try {
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Пользователь не найден"));
            }
            User user = userOptional.get();

            ArtistProfile profile = artistProfileRepository.findByUserUsername(username)
                    .orElseGet(() -> ArtistProfile.builder().user(user).build());

            profile.setName(username);
            profile.setBio(bio);
            profile.setMonthlyListeners(listeners != null ? listeners : 0);

            if (avatar != null && !avatar.isEmpty()) {
                String avatarPath = saveFile(avatar, "avatar_" + username);
                profile.setProfilePictureUrl(avatarPath);
            }
            if (background != null && !background.isEmpty()) {
                String bgPath = saveFile(background, "bg_" + username);
                profile.setHeaderImageUrl(bgPath);
            }

            artistProfileRepository.save(profile);
            return ResponseEntity.ok(Map.of("message", "Профиль успешно сохранен"));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ошибка при сохранении изображений на диск"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Критическая ошибка сервера: " + e.getMessage()));
        }
    }

    private String saveFile(MultipartFile file, String prefix) throws IOException {
        // Создаем папку на диске C:, если её физически не существует
        File folder = new File(uploadFolder);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        String fileName = prefix + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

        // Железобетонное сохранение через абсолютный путь Windows
        File destination = new File(folder.getAbsolutePath() + File.separator + fileName);
        file.transferTo(destination);

        // Возвращаем префикс, который один в один совпадает с твоим WebConfig!
        return "/uploads/" + fileName;
    }
}