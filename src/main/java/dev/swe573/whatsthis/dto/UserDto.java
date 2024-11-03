package dev.swe573.whatsthis.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDto {

    private Long id;
    private String username;
    private String email;

    private List<Long> postIds;
    private List<Long> commentIds;

}
