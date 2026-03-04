package com.smartek.offersservice.service;

import com.smartek.offersservice.dto.ApplicationRequest;
import com.smartek.offersservice.dto.ApplicationResponse;
import com.smartek.offersservice.entity.Application;
import com.smartek.offersservice.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    
    private final ApplicationRepository applicationRepository;
    
    @Transactional
    public ApplicationResponse applyToOffer(ApplicationRequest request) {
        System.out.println("=== APPLICATION SUBMISSION ===");
        System.out.println("Offer ID: " + request.getOfferId());
        System.out.println("Learner ID: " + request.getLearnerId());
        System.out.println("Learner Name: " + request.getLearnerName());
        System.out.println("Learner Email: " + request.getLearnerEmail());
        
        // Vérifier que les IDs ne sont pas null
        if (request.getOfferId() == null || request.getLearnerId() == null) {
            System.out.println("ERROR: Offer ID or Learner ID is null!");
            throw new RuntimeException("Les identifiants de l'offre et de l'apprenant sont requis");
        }
        
        // Vérifier si l'utilisateur a déjà postulé
        boolean alreadyApplied = applicationRepository.existsByOfferIdAndLearnerId(
            request.getOfferId(), 
            request.getLearnerId()
        );
        System.out.println("Already applied check: " + alreadyApplied);
        
        if (alreadyApplied) {
            System.out.println("ERROR: User has already applied to this offer");
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }
        
        Application application = new Application();
        application.setOfferId(request.getOfferId());
        application.setLearnerId(request.getLearnerId());
        application.setLearnerName(request.getLearnerName());
        application.setLearnerEmail(request.getLearnerEmail());
        application.setCoverLetter(request.getCoverLetter());
        application.setCvBase64(request.getCvBase64());
        application.setCvFileName(request.getCvFileName());
        application.setStatus("PENDING");
        
        Application savedApplication = applicationRepository.save(application);
        System.out.println("Application saved successfully with ID: " + savedApplication.getId());
        return mapToResponse(savedApplication);
    }
    
    public List<ApplicationResponse> getApplicationsByOffer(Long offerId) {
        return applicationRepository.findByOfferId(offerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ApplicationResponse> getApplicationsByLearner(Long learnerId) {
        return applicationRepository.findByLearnerId(learnerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public boolean hasApplied(Long offerId, Long learnerId) {
        return applicationRepository.existsByOfferIdAndLearnerId(offerId, learnerId);
    }
    
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return mapToResponse(updatedApplication);
    }
    
    private ApplicationResponse mapToResponse(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getOfferId(),
                application.getLearnerId(),
                application.getLearnerName(),
                application.getLearnerEmail(),
                application.getCoverLetter(),
                application.getCvBase64(),
                application.getCvFileName(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
}
