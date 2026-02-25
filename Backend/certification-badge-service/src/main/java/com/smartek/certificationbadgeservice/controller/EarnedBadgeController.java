package com.smartek.certificationbadgeservice.controller;

import com.smartek.certificationbadgeservice.dto.AwardBadgeRequestDTO;
import com.smartek.certificationbadgeservice.dto.BulkAwardBadgeRequestDTO;
import com.smartek.certificationbadgeservice.dto.BulkAwardResponseDTO;
import com.smartek.certificationbadgeservice.dto.EarnedBadgeDTO;
import com.smartek.certificationbadgeservice.security.AuthorizationService;
import com.smartek.certificationbadgeservice.service.EarnedBadgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing earned badges.
 * Provides endpoints for awarding badges and querying earned badges.
 */
@RestController
@RequestMapping("/api/certifications-badges/earned-badges")
@RequiredArgsConstructor
@Slf4j
public class EarnedBadgeController {
    
    private final EarnedBadgeService earnedBadgeService;
    private final AuthorizationService authorizationService;
    
    /**
     * Award a badge to a single learner.
     * Only accessible by TRAINER and ADMIN roles.
     * The awardedBy field is automatically extracted from the JWT token.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<EarnedBadgeDTO> awardBadge(@Valid @RequestBody AwardBadgeRequestDTO request) {
        // Extract the current user ID from JWT SecurityContext
        Long awardedBy = authorizationService.getCurrentUserId();
        request.setAwardedBy(awardedBy);
        
        log.info("Awarding badge template {} to learner {} by user {}", 
                request.getBadgeTemplateId(), request.getLearnerId(), awardedBy);
        
        EarnedBadgeDTO earnedBadge = earnedBadgeService.awardBadge(request);
        
        log.info("Badge awarded successfully with id: {}", earnedBadge.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(earnedBadge);
    }
    
    /**
     * Award a badge to multiple learners.
     * Only accessible by TRAINER and ADMIN roles.
     * The awardedBy field is automatically extracted from the JWT token.
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<BulkAwardResponseDTO> bulkAwardBadges(@Valid @RequestBody BulkAwardBadgeRequestDTO request) {
        // Extract the current user ID from JWT SecurityContext
        Long awardedBy = authorizationService.getCurrentUserId();
        request.setAwardedBy(awardedBy);
        
        log.info("Bulk awarding badge template {} to {} learners by user {}", 
                request.getBadgeTemplateId(), request.getLearnerIds().size(), awardedBy);
        
        BulkAwardResponseDTO response = earnedBadgeService.bulkAwardBadges(request);
        
        log.info("Bulk award completed: {} successful, {} failed", 
                response.getSuccessCount(), response.getFailureCount());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Get earned badges for a specific learner.
     * Accessible by:
     * - The learner themselves (can only access their own data)
     * - TRAINER (can access any learner's data)
     * - ADMIN (can access any learner's data)
     * - RH_COMPANY or RH_SMARTEK (can access any learner's data)
     */
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<EarnedBadgeDTO>> getEarnedBadgesByLearner(@PathVariable Long learnerId) {
        log.info("Retrieving earned badges for learner: {}", learnerId);
        
        // Check if the current user has permission to access this learner's data
        if (!authorizationService.canAccessLearnerData(learnerId)) {
            log.warn("User {} attempted to access badges for learner {} without permission", 
                    authorizationService.getCurrentUserId(), learnerId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<EarnedBadgeDTO> earnedBadges = earnedBadgeService.findByLearnerId(learnerId);
        log.info("Retrieved {} earned badges for learner {}", earnedBadges.size(), learnerId);
        return ResponseEntity.ok(earnedBadges);
    }
}
