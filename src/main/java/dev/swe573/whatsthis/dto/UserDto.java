package dev.swe573.whatsthis.dto;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String password; //This is going to change. It is here for testing.
    private Set<String> roles;
    private List<Long> postIds;
    private List<Long> commentIds;

}
