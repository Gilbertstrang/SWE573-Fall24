package dev.swe573.whatsthis.repository;

import dev.swe573.whatsthis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
