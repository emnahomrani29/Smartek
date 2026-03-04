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
    private final com.smartek.offersservice.repository.OfferRepository offerRepository;
    
    @Transactional
    public ApplicationResponse applyToOffer(ApplicationRequest request) {
        // Vérifier si l'utilisateur a déjà postulé
        if (applicationRepository.existsByOffer_IdAndLearnerId(request.getOfferId(), request.getLearnerId())) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }
        
        // Charger l'offre
        com.smartek.offersservice.entity.Offer offer = offerRepository.findById(request.getOfferId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        
        Application application = new Application();
        application.setOffer(offer);
        application.setLearnerId(request.getLearnerId());
        application.setLearnerName(request.getLearnerName());
        application.setLearnerEmail(request.getLearnerEmail());
        application.setCoverLetter(request.getCoverLetter());
        application.setCvBase64(request.getCvBase64());
        application.setCvFileName(request.getCvFileName());
        application.setStatus("PENDING");
        
        Application savedApplication = applicationRepository.save(application);
        return mapToResponse(savedApplication);
    }
    
    public List<ApplicationResponse> getApplicationsByOffer(Long offerId) {
        return applicationRepository.findByOffer_Id(offerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ApplicationResponse> getApplicationsByLearner(Long learnerId) {
        return applicationRepository.findByLearnerId(learnerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public boolean hasApplied(Long offerId, Long learnerId) {
        return applicationRepository.existsByOffer_IdAndLearnerId(offerId, learnerId);
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
