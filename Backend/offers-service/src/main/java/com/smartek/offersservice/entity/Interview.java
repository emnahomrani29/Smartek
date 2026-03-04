package com.smartek.offersservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    
    @Column(nullable = false)
    private Long learnerId;
    
    private String learnerName;
    
    private String learnerEmail;
    
    @Column(nullable = false)
    private LocalDateTime interviewDate;
    
    private String location;
    
    private String meetingLink;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;
    
    private Long createdBy;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum InterviewStatus {
        SCHEDULED,
        COMPLETED,
        CANCELLED,
        RESCHEDULED
    }
    
    // Helper methods to get IDs from relationships
    public Long getApplicationId() {
        return application != null ? application.getId() : null;
    }
    
    public Long getOfferId() {
        return application != null && application.getOffer() != null ? application.getOffer().getId() : null;
    }
    
    public void setApplicationId(Long applicationId) {
        // This method is kept for DTO mapping but doesn't set the field
        // The actual application relationship should be set via setApplication()
    }
    
    public void setOfferId(Long offerId) {
        // This method is kept for DTO mapping but doesn't set the field
    }
}
