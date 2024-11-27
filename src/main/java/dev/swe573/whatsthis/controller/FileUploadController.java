package dev.swe573.whatsthis.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    private final String uploadsDir = "uploads/";

    // Upload images and return their URLs
    @PostMapping("/images")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") List<MultipartFile> images) {
        List<String> savedUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                String savedFileName = saveImage(image);
                String fileUrl = "/uploads/" + savedFileName; // Adjust to your URL structure
                savedUrls.add(fileUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
            }
        }

        return ResponseEntity.ok(savedUrls);
    }

    private String saveImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadsDir, "posts/");
        Files.createDirectories(uploadPath); // Create the directory if it doesn't exist

        Path destinationFile = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}

