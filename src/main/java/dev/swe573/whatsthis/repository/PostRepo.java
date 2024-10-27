package dev.swe573.whatsthis.repository;

import dev.swe573.whatsthis.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepo extends JpaRepository<Post, Long> {
}
