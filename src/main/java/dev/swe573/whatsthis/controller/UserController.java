package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.dto.UserDto;
import dev.swe573.whatsthis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    UserController(UserService userService) {
        this.userService = userService;

    }

    @GetMapping()
    public CollectionModel<EntityModel<UserDto>> all() {
        List<EntityModel<UserDto>> users = userService.all().stream()
                .map(userDto -> {
                    EntityModel<UserDto> userModel = EntityModel.of(userDto);
                    userModel.add(linkTo(methodOn(UserController.class).one(userDto.getId())).withSelfRel());
                    return userModel;
                })
                .collect(Collectors.toList());

        return CollectionModel.of(users, linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    @PostMapping
    public EntityModel<UserDto> newUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.newUser(userDto);


        EntityModel<UserDto> userModel = EntityModel.of(createdUser);
        userModel.add(linkTo(methodOn(UserController.class).one(createdUser.getId())).withSelfRel());
        userModel.add(linkTo(methodOn(UserController.class).all()).withRel("users"));

        return userModel;

    }

    @GetMapping("/{id}")
    public EntityModel<UserDto> one(@PathVariable Long id) {
        UserDto userDto = userService.one(id);


        EntityModel<UserDto> userModel = EntityModel.of(userDto);
        userModel.add(linkTo(methodOn(UserController.class).one(id)).withSelfRel());
        userModel.add(linkTo(methodOn(UserController.class).all()).withRel("users"));
        //TODO: There should be links that connects user's previous posts and comments.

        return userModel;
    }

    @PutMapping("/{id}")
    public EntityModel<UserDto> replaceUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.replaceUser(id, userDto);

        EntityModel<UserDto> userModel = EntityModel.of(updatedUser);
        userModel.add(linkTo(methodOn(UserController.class).one(id)).withSelfRel());
        userModel.add(linkTo(methodOn(UserController.class).all()).withRel("users"));

        return userModel;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
