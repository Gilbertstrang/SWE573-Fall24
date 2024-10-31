package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.assembler.UserModelAssembler;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.repository.UserRepo;
import dev.swe573.whatsthis.service.UserService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserModelAssembler assembler;


    UserController(UserService userService, UserModelAssembler assembler) {
        this.userService = userService;
        this.assembler = assembler;
    }

    @GetMapping("/users")
    public CollectionModel<EntityModel<User>> all() {
        return userService.all();
    }

    @PostMapping("/users")
    User newUser(@RequestBody User newUser) {
        return userService.newUser(newUser);
    }

    @GetMapping("/users/{id}")
    public EntityModel<User> one(@PathVariable Long id) {
        return userService.one(id);
    }

    @PutMapping("/users/{id}")
    User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
        return userService.replaceUser(newUser, id);
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
