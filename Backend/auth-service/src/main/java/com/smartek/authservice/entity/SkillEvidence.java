package com.smartek.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "skill_evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SkillEvidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer evidenceId;

    @Column(nullable = false)
    private String title;

    private String fileUrl;

    @Column(length = 1000)
    private String description;

    private LocalDate uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
