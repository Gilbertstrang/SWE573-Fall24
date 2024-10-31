package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.controller.PostNotFoundException;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.repository.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private PostRepo postRepo;
    private UserService userService;

    @Autowired
    public PostService(PostRepo postRepo) {
        this.postRepo = postRepo;

    }

    public List<Post> all() {
        return postRepo.findAll();
    }

    public Optional<Post> one(Long id) {
        return postRepo.findById(id);
    }

    public Post newPost(Post post) {
        return postRepo.save(post);
    }

    public Post updatePost(Long id, Post updatedPost) {
        return postRepo.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setDescription(updatedPost.getDescription());
            post.setUser(updatedPost.getUser());

            post.setMaterial(updatedPost.getMaterial());
            post.setSize(updatedPost.getSize());
            post.setTextAndLanguage(updatedPost.getTextAndLanguage());
            post.setColor(updatedPost.getColor());
            post.setShape(updatedPost.getShape());
            post.setWeight(updatedPost.getWeight());
            post.setDescriptionOfParts(updatedPost.getDescriptionOfParts());
            post.setLocation(updatedPost.getLocation());
            post.setTimePeriod(updatedPost.getTimePeriod());
            post.setSmell(updatedPost.getSmell());
            post.setTaste(updatedPost.getTaste());
            post.setTexture(updatedPost.getTexture());
            post.setHardness(updatedPost.getHardness());
            post.setPattern(updatedPost.getPattern());
            post.setBrand(updatedPost.getBrand());
            post.setPrint(updatedPost.getPrint());
            post.setIcons(updatedPost.getIcons());
            post.setHandmade(updatedPost.getHandmade());
            post.setFunctionality(updatedPost.getFunctionality());

            post.setTags(updatedPost.getTags());

            post.setImageUrls(updatedPost.getImageUrls());

            return postRepo.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
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
