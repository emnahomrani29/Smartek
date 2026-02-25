package com.smartek.authservice.dto;

import com.smartek.authservice.enums.LearningStyleType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningStylePreferenceDto {

    @NotNull(message = "Le style préféré est obligatoire")
    private LearningStyleType preferredStyle;

    private Boolean videoPreferred;
    private Boolean textPreferred;
    private Boolean practicalWorkPreferred;
}
