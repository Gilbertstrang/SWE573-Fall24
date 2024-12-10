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

        if (commentDto.getParentCommentId() != null) {
            Comment parentComment = commentRepo.findById(commentDto.getParentCommentId())
                    .orElseThrow(() -> new CommentNotFoundException(commentDto.getParentCommentId()));
            comment.setParentComment(parentComment);
        }

        comment = commentRepo.save(comment);
        return toDto(comment);
    }

    public CommentDto toDto(Comment comment) {
        CommentDto commentDTO = new CommentDto();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setVotes(comment.getVotes());
        commentDTO.setUserId(comment.getUserId());
        commentDTO.setPostId(comment.getPostId());
        commentDTO.setUsername(comment.getUsername());
        commentDTO.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        commentDTO.setImageUrls(comment.getImageUrls());
        return commentDTO;
    }

    public Comment toEntity(CommentDto commentDto) {
        Comment comment = new Comment();
        comment.setText(commentDto.getText());
        comment.setVotes(commentDto.getVotes());
        comment.setUsername(commentDto.getUsername());

        comment.setUserId(commentDto.getUserId());

        comment.setPostId(commentDto.getPostId());

        comment.setImageUrls(commentDto.getImageUrls());

        return comment;
    }

    public List<CommentDto> getCommentsByPostId(Long postId) {
        return commentRepo.findByPostId(postId).stream()
                .map(comment -> {
                    CommentDto commentDto = toDto(comment);
                    commentDto.setUsername(userRepo.findById(comment.getUserId())
                            .map(User::getUsername).orElse("Unknown"));
                    return commentDto;
                })
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
