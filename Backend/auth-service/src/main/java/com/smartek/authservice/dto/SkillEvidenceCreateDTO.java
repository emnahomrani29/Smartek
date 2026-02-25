package com.smartek.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillEvidenceCreateDTO {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, max = 150)
    private String title;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;

    private String fileUrl;

    private LocalDate uploadDate;


}
