package dev.swe573.whatsthis.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="users")
@Data
public class User {

    private @Id
    @GeneratedValue Long id;

    private String username;
    private String email;
    private String password;
}
