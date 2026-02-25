package com.smartek.certificationbadgeservice.service;

import com.smartek.certificationbadgeservice.dto.*;
import com.smartek.certificationbadgeservice.entity.CertificationTemplate;
import com.smartek.certificationbadgeservice.entity.EarnedCertification;
import com.smartek.certificationbadgeservice.exception.ResourceNotFoundException;
import com.smartek.certificationbadgeservice.exception.ValidationException;
import com.smartek.certificationbadgeservice.mapper.EarnedCertificationMapper;
import com.smartek.certificationbadgeservice.repository.CertificationTemplateRepository;
import com.smartek.certificationbadgeservice.repository.EarnedCertificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EarnedCertificationService {
    
    private final EarnedCertificationRepository earnedCertificationRepository;
    private final CertificationTemplateRepository certificationTemplateRepository;
    private final EarnedCertificationMapper earnedCertificationMapper;
    
    @Transactional(propagation = Propagation.REQUIRED)
    public EarnedCertificationDTO awardCertification(AwardCertificationRequestDTO request) {
        MDC.put("operation", "AWARD_CERTIFICATION");
        MDC.put("userId", String.valueOf(request.getAwardedBy()));
        try {
            log.info("Awarding certification template {} to learner {}", 
                    request.getCertificationTemplateId(), request.getLearnerId());
            
            // Validate certification template exists
            CertificationTemplate certificationTemplate = certificationTemplateRepository.findById(request.getCertificationTemplateId())
                    .orElseThrow(() -> {
                        log.warn("Certification template not found with id: {}", request.getCertificationTemplateId());
                        return new ResourceNotFoundException("Certification template not found with id: " + request.getCertificationTemplateId());
                    });
            
            // Validate dates
            if (request.getExpiryDate() != null && request.getIssueDate() != null 
                    && request.getExpiryDate().isBefore(request.getIssueDate())) {
                log.warn("Invalid date range: expiry date {} is before issue date {}", 
                        request.getExpiryDate(), request.getIssueDate());
                throw new ValidationException("Expiry date cannot be before issue date");
            }
            
            // Validate certificate URL if provided
            if (request.getCertificateUrl() != null && !request.getCertificateUrl().trim().isEmpty()) {
                validateUrl(request.getCertificateUrl());
            }
            
            // Create earned certification
            EarnedCertification earnedCertification = new EarnedCertification();
            earnedCertification.setCertificationTemplate(certificationTemplate);
            earnedCertification.setLearnerId(request.getLearnerId());
            earnedCertification.setIssueDate(request.getIssueDate());
            earnedCertification.setExpiryDate(request.getExpiryDate());
            earnedCertification.setCertificateUrl(request.getCertificateUrl());
            earnedCertification.setAwardedBy(request.getAwardedBy());
            
            EarnedCertification saved = earnedCertificationRepository.save(earnedCertification);
            
            log.info("Successfully awarded certification {} to learner {} by user {}", 
                    request.getCertificationTemplateId(), request.getLearnerId(), request.getAwardedBy());
            return earnedCertificationMapper.toDTO(saved);
        } catch (ValidationException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error awarding certification {} to learner {}", 
                    request.getCertificationTemplateId(), request.getLearnerId(), e);
            throw e;
        } finally {
            MDC.remove("operation");
            MDC.remove("userId");
        }
    }
    
    @Transactional
    public BulkAwardResponseDTO bulkAwardCertifications(BulkAwardCertificationRequestDTO request) {
        MDC.put("operation", "BULK_AWARD_CERTIFICATIONS");
        MDC.put("userId", String.valueOf(request.getAwardedBy()));
        try {
            log.info("Bulk awarding certification template {} to {} learners", 
                    request.getCertificationTemplateId(), request.getLearnerIds().size());
            
            List<AwardResultDTO> results = new ArrayList<>();
            
            // Validate certification template exists once
            if (!certificationTemplateRepository.existsById(request.getCertificationTemplateId())) {
                log.warn("Certification template not found with id: {}", request.getCertificationTemplateId());
                // If template doesn't exist, all awards fail
                for (Long learnerId : request.getLearnerIds()) {
                    results.add(AwardResultDTO.failure(learnerId, 
                        "Certification template not found with id: " + request.getCertificationTemplateId()));
                }
                return new BulkAwardResponseDTO(results);
            }
            
            // Validate dates once
            if (request.getExpiryDate() != null && request.getIssueDate() != null 
                    && request.getExpiryDate().isBefore(request.getIssueDate())) {
                log.warn("Invalid date range: expiry date {} is before issue date {}", 
                        request.getExpiryDate(), request.getIssueDate());
                // If dates are invalid, all awards fail
                for (Long learnerId : request.getLearnerIds()) {
                    results.add(AwardResultDTO.failure(learnerId, 
                        "Expiry date cannot be before issue date"));
                }
                return new BulkAwardResponseDTO(results);
            }
            
            // Validate certificate URL once if provided
            if (request.getCertificateUrl() != null && !request.getCertificateUrl().trim().isEmpty()) {
                try {
                    validateUrl(request.getCertificateUrl());
                } catch (ValidationException e) {
                    log.warn("Invalid certificate URL: {}", request.getCertificateUrl());
                    // If URL is invalid, all awards fail
                    for (Long learnerId : request.getLearnerIds()) {
                        results.add(AwardResultDTO.failure(learnerId, e.getMessage()));
                    }
                    return new BulkAwardResponseDTO(results);
                }
            }
            
            // Process each learner individually with independent transactions (savepoint-based)
            for (Long learnerId : request.getLearnerIds()) {
                try {
                    AwardCertificationRequestDTO individualRequest = new AwardCertificationRequestDTO();
                    individualRequest.setCertificationTemplateId(request.getCertificationTemplateId());
                    individualRequest.setLearnerId(learnerId);
                    individualRequest.setIssueDate(request.getIssueDate());
                    individualRequest.setExpiryDate(request.getExpiryDate());
                    individualRequest.setCertificateUrl(request.getCertificateUrl());
                    individualRequest.setAwardedBy(request.getAwardedBy());
                    
                    // Each award is in its own nested transaction (savepoint)
                    awardCertificationWithSavepoint(individualRequest);
                    results.add(AwardResultDTO.success(learnerId));
                    
                } catch (Exception e) {
                    log.error("Error awarding certification to learner {}", learnerId, e);
                    results.add(AwardResultDTO.failure(learnerId, "Failed to award certification: " + e.getMessage()));
                }
            }
            
            BulkAwardResponseDTO response = new BulkAwardResponseDTO(results);
            log.info("Bulk award completed: {} successful, {} failed", 
                    response.getSuccessCount(), response.getFailureCount());
            return response;
        } catch (Exception e) {
            log.error("Error in bulk award certifications operation", e);
            throw e;
        } finally {
            MDC.remove("operation");
            MDC.remove("userId");
        }
    }
    
    /**
     * Award certification with REQUIRES_NEW propagation to create a savepoint.
     * If this fails, only this individual award is rolled back, not the entire bulk operation.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected EarnedCertificationDTO awardCertificationWithSavepoint(AwardCertificationRequestDTO request) {
        // Validate certification template exists
        CertificationTemplate certificationTemplate = certificationTemplateRepository.findById(request.getCertificationTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Certification template not found with id: " + request.getCertificationTemplateId()));
        
        // Create earned certification
        EarnedCertification earnedCertification = new EarnedCertification();
        earnedCertification.setCertificationTemplate(certificationTemplate);
        earnedCertification.setLearnerId(request.getLearnerId());
        earnedCertification.setIssueDate(request.getIssueDate());
        earnedCertification.setExpiryDate(request.getExpiryDate());
        earnedCertification.setCertificateUrl(request.getCertificateUrl());
        earnedCertification.setAwardedBy(request.getAwardedBy());
        
        EarnedCertification saved = earnedCertificationRepository.save(earnedCertification);
        
        return earnedCertificationMapper.toDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<EarnedCertificationDTO> findByLearnerId(Long learnerId) {
        MDC.put("operation", "FIND_EARNED_CERTIFICATIONS_BY_LEARNER");
        try {
            log.info("Retrieving earned certifications for learner {}", learnerId);
            List<EarnedCertification> earnedCertifications = earnedCertificationRepository.findByLearnerId(learnerId);
            
            log.info("Successfully retrieved {} earned certifications for learner {}", 
                    earnedCertifications.size(), learnerId);
            return earnedCertifications.stream()
                    .map(earnedCertificationMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving earned certifications for learner {}", learnerId, e);
            throw e;
        } finally {
            MDC.remove("operation");
        }
    }
    
    private void validateUrl(String url) {
        try {
            new URL(url);
        } catch (MalformedURLException e) {
            log.warn("Invalid certificate URL format: {}", url);
            throw new ValidationException("Invalid certificate URL format: " + url);
        }
    }
}
