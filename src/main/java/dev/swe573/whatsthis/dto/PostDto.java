package dev.swe573.whatsthis.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostDto {
    private String title;
    private String description;
    private List<String> tags;
    private List<String> imageUrls;
    private String material;
    private String size;
    private String color;
    private String shape;
    private String weight;
    private String location;
    private String timePeriod;
    private String pattern;
    private Boolean handmade;
    private String functionality;
    private Long userId;  // User ID to associate with the post
}
