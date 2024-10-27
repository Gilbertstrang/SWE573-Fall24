package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/post")
public class PostController {

    private PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> all(@RequestParam Optional<Long> userId) {
        return postService.all(userId);
    }

    @GetMapping("/{id}")
    public Post one(@PathVariable Long id) {
        return postService.one(id);
    }

    @PostMapping
    public Post newPost (@RequestBody Post post) {
        return postService.newPost(post);
    }
}
