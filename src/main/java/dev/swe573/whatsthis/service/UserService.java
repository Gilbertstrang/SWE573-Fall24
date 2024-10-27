package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.assembler.UserModelAssembler;
import dev.swe573.whatsthis.controller.UserController;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.repository.UserRepo;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class UserService {

    private UserRepo userRepo;
    UserModelAssembler assembler;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public CollectionModel<EntityModel<User>> all() {
        List<EntityModel<User>> users = userRepo.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(users,linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    public User newUser(User newUser) {
        return userRepo.save(newUser);
    }

    public EntityModel<User> one(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow( () -> new UserNotFoundException(id));
        return assembler.toModel(user);
    }

    public User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
        return userRepo.findById(id)
                .map(user -> {
                    user.setUsername(newUser.getUsername());
                    user.setEmail(newUser.getEmail());
                    user.setPassword(newUser.getPassword());

                    return userRepo.save(user);
                })
                .orElseGet(() -> {
                    return userRepo.save(newUser);
                });
    }

    public void deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
    }
}
