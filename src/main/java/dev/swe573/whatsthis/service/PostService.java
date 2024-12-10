package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.controller.CommentNotFoundException;
import dev.swe573.whatsthis.controller.PostNotFoundException;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.dto.PartDto;
import dev.swe573.whatsthis.dto.PostDto;
import dev.swe573.whatsthis.dto.TagDto;
import dev.swe573.whatsthis.model.Part;
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
        System.out.println("Parts before saving: " + post.getParts());
        post = postRepo.save(post);
        System.out.println("Parts after saving: " + post.getParts());
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

        //optional
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


//        post.setComments(new ArrayList<>());

        System.out.println("Incoming parts data: " + postDto.getParts());

        if (postDto.getParts() != null && !postDto.getParts().isEmpty()) {
            List<Part> parts = postDto.getParts().stream()
                .map(partDto -> {
                    Part part = new Part();
                    part.setPartName(partDto.getPartName());
                    part.setMaterial(partDto.getMaterial());
                    part.setSize(partDto.getSize());
                    part.setTextAndLanguage(partDto.getTextAndLanguage());
                    part.setColor(partDto.getColor());
                    part.setShape(partDto.getShape());
                    part.setWeight(partDto.getWeight());
                    part.setDescriptionOfParts(partDto.getDescriptionOfParts());
                    part.setLocation(partDto.getLocation());
                    part.setTimePeriod(partDto.getTimePeriod());
                    part.setSmell(partDto.getSmell());
                    part.setTaste(partDto.getTaste());
                    part.setTexture(partDto.getTexture());
                    part.setHardness(partDto.getHardness());
                    part.setPattern(partDto.getPattern());
                    part.setBrand(partDto.getBrand());
                    part.setPrint(partDto.getPrint());
                    part.setIcons(partDto.getIcons());
                    part.setHandmade(partDto.getHandmade());
                    part.setFunctionality(partDto.getFunctionality());
                    return part;
                })
                .collect(Collectors.toList());
            post.setParts(parts);
        } else {
            post.setParts(new ArrayList<>());
        }

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

        System.out.println("Converting parts to DTO: " + post.getParts());

        if (post.getParts() != null && !post.getParts().isEmpty()) {
            List<PartDto> partDtos = post.getParts().stream()
                .map(part -> {
                    PartDto partDto = new PartDto();
                    partDto.setPartName(part.getPartName());
                    partDto.setMaterial(part.getMaterial());
                    partDto.setSize(part.getSize());
                    partDto.setTextAndLanguage(part.getTextAndLanguage());
                    partDto.setColor(part.getColor());
                    partDto.setShape(part.getShape());
                    partDto.setWeight(part.getWeight());
                    partDto.setDescriptionOfParts(part.getDescriptionOfParts());
                    partDto.setLocation(part.getLocation());
                    partDto.setTimePeriod(part.getTimePeriod());
                    partDto.setSmell(part.getSmell());
                    partDto.setTaste(part.getTaste());
                    partDto.setTexture(part.getTexture());
                    partDto.setHardness(part.getHardness());
                    partDto.setPattern(part.getPattern());
                    partDto.setBrand(part.getBrand());
                    partDto.setPrint(part.getPrint());
                    partDto.setIcons(part.getIcons());
                    partDto.setHandmade(part.getHandmade());
                    partDto.setFunctionality(part.getFunctionality());
                    return partDto;
                })
                .collect(Collectors.toList());
            postDto.setParts(partDtos);
        } else {
            postDto.setParts(new ArrayList<>());
        }

        postDto.setSolutionCommentId(post.getSolutionCommentId());
        postDto.setSolved(post.isSolved());

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

    public List<PostDto> getPostsByUserId(Long userId) {
        return postRepo.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDto markAsSolution(Long postId, Long commentId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));


        if (!comment.getPostId().equals(postId)) {
            throw new IllegalArgumentException("Comment does not belong to this post");
        }

        post.setSolutionCommentId(commentId);
        post.setSolved(true);
        
        Post updatedPost = postRepo.save(post);
        return toDto(updatedPost);
    }
}
