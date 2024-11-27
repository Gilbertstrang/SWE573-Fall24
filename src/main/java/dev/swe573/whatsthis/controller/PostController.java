package dev.swe573.whatsthis.controller;

import dev.swe573.whatsthis.dto.CommentDto;
import dev.swe573.whatsthis.dto.PostDto;
import dev.swe573.whatsthis.dto.TagDto;
import dev.swe573.whatsthis.service.CommentService;
import dev.swe573.whatsthis.service.PostService;
import dev.swe573.whatsthis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private PostService postService;
    private UserService userService;
    private CommentService commentService;

    @Autowired
    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    //Get all posts
    @GetMapping
    public CollectionModel<EntityModel<PostDto>> all() {
        List<EntityModel<PostDto>> posts = postService.all().stream()
                .map(postDto -> EntityModel.of(postDto,
                        linkTo(methodOn(PostController.class).one(postDto.getId())).withSelfRel(),
                        linkTo(methodOn(PostController.class).all()).withRel("all-posts"),
                        linkTo(methodOn(PostController.class).getCommentsByPost(postDto.getId())).withRel("comments")
                )).collect(Collectors.toList());

        return CollectionModel.of(posts, linkTo(methodOn(PostController.class).all()).withSelfRel());
    }

    //Get a post by id
    @GetMapping("/{id}")
    public EntityModel<PostDto> one(@PathVariable Long id) {
        PostDto postDto = postService.one(id);
        EntityModel<PostDto> postModel = EntityModel.of(postDto,
                linkTo(methodOn(PostController.class).one(id)).withSelfRel(),
                linkTo(methodOn(PostController.class).all()).withRel("all-posts"),
                linkTo(methodOn(PostController.class).getCommentsByPost(id)).withRel("comments"));

        return postModel;
    }

    //Create new post
    @PostMapping
    public EntityModel<PostDto> newPost(@RequestBody PostDto postDto) {
        PostDto createdPost = postService.newPost(postDto);
        return EntityModel.of(createdPost,
                linkTo(methodOn(PostController.class).one(createdPost.getId())).withSelfRel(),
                linkTo(methodOn(PostController.class).all()).withRel("all-posts"));
    }

    //Update existing post
    @PutMapping("/{id}")
    public EntityModel<PostDto> updatePost (@PathVariable Long id, @RequestBody PostDto postDto) {
        postDto.setId(id);

        PostDto updatedPost = postService.updatePost(postDto);

        return EntityModel.of(updatedPost,
                linkTo(methodOn(PostController.class).one(id)).withSelfRel(),
                linkTo(methodOn(PostController.class).all()).withRel("all-posts"));
    }

    @GetMapping("/{postId}/comments")
    public CollectionModel<EntityModel<CommentDto>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentDto> comments = commentService.getCommentsByPostId(postId);
        List<EntityModel<CommentDto>> commentModels = comments.stream()
                .map(commentDTO -> EntityModel.of(commentDTO,
                        linkTo(methodOn(PostController.class).getCommentsByPost(postId)).withRel("post-comments"),
                        linkTo(methodOn(PostController.class).one(postId)).withRel("post")))
                .collect(Collectors.toList());

        return CollectionModel.of(commentModels, linkTo(methodOn(PostController.class).getCommentsByPost(postId)).withSelfRel());
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
