package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.assembler.UserModelAssembler;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.repository.UserRepo;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class UserController {
    private final UserRepo repo;
    private final UserModelAssembler assembler;

    UserController(UserRepo repo, UserModelAssembler assembler) {
        this.repo = repo;
        this.assembler = assembler;
    }

    @GetMapping("/users")
    public CollectionModel<EntityModel<User>> all() {
        List<EntityModel<User>> users = repo.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(users,linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    @PostMapping("/users")
    User newUser(@RequestBody User newUser) {
        return repo.save(newUser);
    }

    @GetMapping("/users/{id}")
    public EntityModel<User> one(@PathVariable Long id) {

        User user = repo.findById(id)
                .orElseThrow( () -> new UserNotFoundException(id));
        return assembler.toModel(user);
    }

    @PutMapping("/users/{id}")
    User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
        return repo.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setEmail(newUser.getEmail());
                    user.setPassword(newUser.getPassword());

                    return repo.save(user);
                })
                .orElseGet(() -> {
                    return repo.save(newUser);
                });
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
