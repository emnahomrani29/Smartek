package com.smartek.offersservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;
    
    @Column(nullable = false)
    private Long learnerId;
    
    private String learnerName;
    
    private String learnerEmail;
    
    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String cvBase64;
    
    private String cvFileName;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Interview> interviews = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime appliedAt;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Helper methods to get IDs from relationships
    public Long getOfferId() {
        return offer != null ? offer.getId() : null;
    }
    
    public void setOfferId(Long offerId) {
        // This method is kept for DTO mapping but doesn't set the field
        // The actual offer relationship should be set via setOffer()
    }
}
