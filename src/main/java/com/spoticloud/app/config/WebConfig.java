package com.spoticloud.app.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/media/tracks/**")
                .addResourceLocations("file:///C:/spcl_uploads/spoticloud_media/");

        registry.addResourceHandler("/media/covers/**")
                .addResourceLocations("file:///C:/spcl_uploads/spoticloud_covers/");
    }

}