package com.smartek.offersservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String contractType;
    private String salary;
    private Long companyId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
