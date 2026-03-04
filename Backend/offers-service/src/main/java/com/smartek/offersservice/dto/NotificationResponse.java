package com.smartek.offersservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String userRole;
    private String type;
    private String title;
    private String message;
    private Long relatedOfferId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
