package dev.swe573.whatsthis.service;


import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.dto.UserDto;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.model.Comment;
import dev.swe573.whatsthis.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;


    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<UserDto> all() {
        List<User> users = userRepo.findAll();
        return users.stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserDto newUser(UserDto userDto) {
        User user = toEntity(userDto);
        User savedUser = userRepo.save(user);
        return toDto(savedUser);
    }

    public UserDto one(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return toDto(user);
    }

    public UserDto replaceUser(Long id, UserDto userDto) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());// DANGEROUS TO PUT PASSWORD LIKE THIS MY MAN
                                                // WE GOING TO SECURE IT LATER :(

        User updatedUser = userRepo.save(user);
        return toDto(updatedUser);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    private UserDto toDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword()); // DONT FORGET TO REMOVE THIS
        userDto.setPostIds(user.getPosts().stream().map(Post::getId).collect(Collectors.toList()));
        userDto.setCommentIds(user.getComments().stream().map(Comment::getId).collect(Collectors.toList()));
        return userDto;
    }

    private User toEntity(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(user.getPassword());// DONT FORGET TO SECURE PASSWORD
        return user;
    }
}
