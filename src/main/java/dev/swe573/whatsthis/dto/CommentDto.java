package dev.swe573.whatsthis.dto;

import lombok.Data;

@Data
public class CommentDto {

    private Long id;
    private String text;
    private int votes;

    private Long userId;
    private Long postId;
}
