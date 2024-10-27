package dev.swe573.whatsthis.repository;

import dev.swe573.whatsthis.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long aLong);
}
