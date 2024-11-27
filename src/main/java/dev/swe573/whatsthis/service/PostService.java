package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.controller.CommentNotFoundException;
import dev.swe573.whatsthis.controller.PostNotFoundException;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.dto.PostDto;
import dev.swe573.whatsthis.dto.TagDto;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.model.Comment;
import dev.swe573.whatsthis.repository.CommentRepo;
import dev.swe573.whatsthis.repository.PostRepo;
import dev.swe573.whatsthis.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepo postRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    public PostService(PostRepo postRepo) {
        this.postRepo = postRepo;

    }

    @Autowired
    private TagService tagService;

    public List<PostDto> all() {
        return postRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostDto one(Long id) {
        Post post =  postRepo.findById(id).orElseThrow(() -> new PostNotFoundException(id));
        return toDto(post);
    }

    @Transactional
    public PostDto newPost(PostDto postDto) {
        Post post = toEntity(postDto);
        post = postRepo.save(post);
        return toDto(post);
    }

    private Post toEntity(PostDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setVotes(postDto.getVotes());
        post.setImageUrls(postDto.getImageUrls() != null ? postDto.getImageUrls() : new ArrayList<>());

        if (postDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null.");
        }
        post.setUserId(postDto.getUserId());

        // Set other optional fields
        post.setMaterial(postDto.getMaterial());
        post.setSize(postDto.getSize());
        post.setColor(postDto.getColor());
        post.setShape(postDto.getShape());
        post.setWeight(postDto.getWeight());
        post.setTextAndLanguage(postDto.getTextAndLanguage());
        post.setSmell(postDto.getSmell());
        post.setTaste(postDto.getTaste());
        post.setTexture(postDto.getTexture());
        post.setHardness(postDto.getHardness());
        post.setPattern(postDto.getPattern());
        post.setBrand(postDto.getBrand());
        post.setPrint(postDto.getPrint());
        post.setLocation(postDto.getLocation());
        post.setTimePeriod(postDto.getTimePeriod());
        post.setHandmade(postDto.getHandmade());
        post.setFunctionality(postDto.getFunctionality());


        post.setTags(postDto.getTags() != null ? postDto.getTags() : new ArrayList<>());


        post.setComments(new ArrayList<>());

        return post;
    }

    private PostDto toDto(Post post) {
        PostDto postDto = new PostDto();

        postDto.setId(post.getId());
        postDto.setTitle(post.getTitle());
        postDto.setDescription(post.getDescription());
        postDto.setVotes(post.getVotes());
        postDto.setUserId(post.getUserId());

        postDto.setImageUrls(
                post.getImageUrls().stream()
                        .map(fileName -> "/uploads/posts/" + fileName)
                        .collect(Collectors.toList())
        );

        postDto.setMaterial(post.getMaterial());
        postDto.setSize(post.getSize());
        postDto.setColor(post.getColor());
        postDto.setShape(post.getShape());
        postDto.setWeight(post.getWeight());
        postDto.setTextAndLanguage(post.getTextAndLanguage());
        postDto.setSmell(post.getSmell());
        postDto.setTaste(post.getTaste());
        postDto.setTexture(post.getTexture());
        postDto.setHardness(post.getHardness());
        postDto.setPattern(post.getPattern());
        postDto.setBrand(post.getBrand());
        postDto.setPrint(post.getPrint());
        postDto.setLocation(post.getLocation());
        postDto.setTimePeriod(post.getTimePeriod());
        postDto.setHandmade(post.getHandmade());
        postDto.setFunctionality(post.getFunctionality());

        postDto.setComments(new ArrayList<>());

        postDto.setTags(post.getTags() != null ? post.getTags() : new ArrayList<>());

        return postDto;
    }

    public List<TagDto> getTagSuggestions(String query) {
        return tagService.searchTags(query);
    }

    public PostDto updatePost(PostDto postDto) {
        Post existingPost = postRepo.findById(postDto.getId())
                .orElseThrow(() -> new PostNotFoundException(postDto.getId()));

        existingPost.setTitle(postDto.getTitle());
        existingPost.setDescription(postDto.getDescription());
        existingPost.setImageUrls(postDto.getImageUrls());
        existingPost.setTags(postDto.getTags());

        existingPost.setMaterial(postDto.getMaterial());
        existingPost.setSize(postDto.getSize());
        existingPost.setColor(postDto.getColor());
        existingPost.setShape(postDto.getShape());
        existingPost.setWeight(postDto.getWeight());
        existingPost.setTextAndLanguage(postDto.getTextAndLanguage());
        existingPost.setSmell(postDto.getSmell());
        existingPost.setTaste(postDto.getTaste());
        existingPost.setTexture(postDto.getTexture());
        existingPost.setHardness(postDto.getHardness());
        existingPost.setPattern(postDto.getPattern());
        existingPost.setBrand(postDto.getBrand());
        existingPost.setPrint(postDto.getPrint());
        existingPost.setLocation(postDto.getLocation());
        existingPost.setTimePeriod(postDto.getTimePeriod());
        existingPost.setHandmade(postDto.getHandmade());
        existingPost.setFunctionality(postDto.getFunctionality());

        existingPost = postRepo.save(existingPost);
        return toDto(existingPost);
    }

    public void upvotePost(Long id) {
        postRepo.findById(id).ifPresent(post -> {
            post.setVotes(post.getVotes() + 1);
            postRepo.save(post);
        });
    }

    public void downvotePost(Long id) {
        postRepo.findById(id).ifPresent(post -> {
            post.setVotes(post.getVotes() + 1);
            postRepo.save(post);
        });
    }
}
