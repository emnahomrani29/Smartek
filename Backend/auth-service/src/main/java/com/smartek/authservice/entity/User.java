package com.smartek.authservice.entity;

import com.smartek.authservice.enums.RoleType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité User pour la plateforme SMARTEK
 */
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Lob
    @Column(name = "image", columnDefinition = "BLOB")
    private byte[] image;
    
    @Column(nullable = false, length = 50)
    private String firstName;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(length = 20)
    private String phone;
    
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer experience = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoleType role;
}
