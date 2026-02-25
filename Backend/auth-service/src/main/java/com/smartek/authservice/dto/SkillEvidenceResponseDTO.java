package com.smartek.authservice.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillEvidenceResponseDTO {

    private Integer evidenceId;

    private String title;

    private String description;

    private String fileUrl;

    private LocalDate uploadDate;


    private String userFirstName;
    private String userEmail;


}
