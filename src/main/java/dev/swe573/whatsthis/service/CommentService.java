package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.controller.CommentNotFoundException;
import dev.swe573.whatsthis.controller.PostNotFoundException;
import dev.swe573.whatsthis.controller.UserNotFoundException;
import dev.swe573.whatsthis.dto.CommentDto;
import dev.swe573.whatsthis.model.Comment;
import dev.swe573.whatsthis.model.Post;
import dev.swe573.whatsthis.model.User;
import dev.swe573.whatsthis.repository.CommentRepo;
import dev.swe573.whatsthis.repository.PostRepo;
import dev.swe573.whatsthis.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PostRepo postRepo;

    public CommentDto newComment(CommentDto commentDto) {
        Comment comment = toEntity(commentDto);
        comment = commentRepo.save(comment);
        return toDto(comment);
    }

    public CommentDto toDto(Comment comment) {
        CommentDto commentDTO = new CommentDto();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setVotes(comment.getVotes());
        commentDTO.setUserId(comment.getUser().getId());
        commentDTO.setPostId(comment.getPost().getId());
        return commentDTO;
    }

    public Comment toEntity(CommentDto commentDto) {
        Comment comment = new Comment();
        comment.setText(commentDto.getText());
        comment.setVotes(commentDto.getVotes());

        User user = userRepo.findById(commentDto.getUserId())
                .orElseThrow(() -> new UserNotFoundException(commentDto.getUserId()));
        comment.setUser(user);

        Post post = postRepo.findById(commentDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException(commentDto.getPostId()));
        comment.setPost(post);

        return comment;
    }

    public List<CommentDto> getCommentsByPostId(Long postId) {
        return commentRepo.findById(postId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CommentDto getCommentById(Long commentId){
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        return toDto(comment);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));
        commentRepo.delete(comment);
    }

    public CommentDto upvoteComment(Long commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        comment.setVotes(comment.getVotes() + 1);
        comment = commentRepo.save(comment);

        return toDto(comment);
    }

    public CommentDto downvoteComment(Long commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        comment.setVotes(comment.getVotes() - 1);
        comment = commentRepo.save(comment);
        return toDto(comment);
    }

}
