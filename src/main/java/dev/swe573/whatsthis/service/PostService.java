package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.controller.PostNotFoundException;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.repository.PostRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private PostRepo postRepo;

    public PostService(PostRepo postRepo) {
        this.postRepo = postRepo;
    }

    public List<Post> all(Optional<Long> userId) {
        if(userId.isPresent()) return postRepo.findByUserId(userId.get());

        return postRepo.findAll();
    }

    public Post one(Long id) {
        return postRepo.findById(id).orElseThrow( () -> new PostNotFoundException(id));
    }

    public Post newPost(Post post) {
        return postRepo.save(post);
    }
}
