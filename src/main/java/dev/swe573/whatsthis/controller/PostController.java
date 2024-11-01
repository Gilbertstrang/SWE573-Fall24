package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.dto.PostDto;
import dev.swe573.whatsthis.dto.TagDto;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.service.PostService;
import dev.swe573.whatsthis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private PostService postService;
    private UserService userService;

    @Autowired
    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @GetMapping
    public List<Post> all() {
        return postService.all();
    }

    @GetMapping("/{id}")
    public Optional<Post> one(@PathVariable Long id) {
        return postService.one(id);
    }

    @PostMapping
    public ResponseEntity<Post> newPost (@RequestBody PostDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());

        post.setTags(postDto.getTags());
        post.setImageUrls(postDto.getImageUrls());


        User user = userService.one(postDto.getUserId()).getContent();
        post.setUser(user);


        post.setMaterial(postDto.getMaterial());
        post.setSize(postDto.getSize());
        post.setColor(postDto.getColor());
        post.setShape(postDto.getShape());
        post.setWeight(postDto.getWeight());
        post.setLocation(postDto.getLocation());
        post.setTimePeriod(postDto.getTimePeriod());
        post.setPattern(postDto.getPattern());
        post.setHandmade(postDto.getHandmade());
        post.setFunctionality(postDto.getFunctionality());

        Post createdPost = postService.newPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @PutMapping("/{id}")
    public Post updatePost (@PathVariable Long id, @RequestBody Post post) {
        return postService.updatePost(id, post);
    }

    @GetMapping("/tags")
    public List<TagDto> getTagSuggestions(@RequestParam String query) {
        return postService.getTagSuggestions(query);
    }

    @PostMapping("/{id}/upvote")
    public void upvotePost(@PathVariable Long id) {
        postService.upvotePost(id);
    }

    @PostMapping("/{id}/downvote")
    public void downvotePost(@PathVariable Long id) {
        postService.downvotePost(id);
    }
}
