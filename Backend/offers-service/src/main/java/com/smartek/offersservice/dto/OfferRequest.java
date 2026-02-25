package com.smartek.offersservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Contract type is required")
    private String contractType;
    
    private String salary;
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    private String status;
}
