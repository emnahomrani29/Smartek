package com.smartek.offersservice.service;

import com.smartek.offersservice.dto.OfferRequest;
import com.smartek.offersservice.dto.OfferResponse;
import com.smartek.offersservice.entity.Offer;
import com.smartek.offersservice.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService {
    
    private final OfferRepository offerRepository;
    
    @Transactional
    public OfferResponse createOffer(OfferRequest request) {
        Offer offer = new Offer();
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setCompanyName(request.getCompanyName());
        offer.setLocation(request.getLocation());
        offer.setContractType(request.getContractType());
        offer.setSalary(request.getSalary());
        offer.setCompanyId(request.getCompanyId());
        offer.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        
        Offer savedOffer = offerRepository.save(offer);
        return mapToResponse(savedOffer);
    }
    
    public List<OfferResponse> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public OfferResponse getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
        return mapToResponse(offer);
    }
    
    public List<OfferResponse> getOffersByCompanyId(Long companyId) {
        return offerRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<OfferResponse> getOffersByStatus(String status) {
        return offerRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public OfferResponse updateOffer(Long id, OfferRequest request) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
        
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setCompanyName(request.getCompanyName());
        offer.setLocation(request.getLocation());
        offer.setContractType(request.getContractType());
        offer.setSalary(request.getSalary());
        if (request.getStatus() != null) {
            offer.setStatus(request.getStatus());
        }
        
        Offer updatedOffer = offerRepository.save(offer);
        return mapToResponse(updatedOffer);
    }
    
    @Transactional
    public void deleteOffer(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new RuntimeException("Offer not found with id: " + id);
        }
        offerRepository.deleteById(id);
    }
    
    private OfferResponse mapToResponse(Offer offer) {
        return new OfferResponse(
                offer.getId(),
                offer.getTitle(),
                offer.getDescription(),
                offer.getCompanyName(),
                offer.getLocation(),
                offer.getContractType(),
                offer.getSalary(),
                offer.getCompanyId(),
                offer.getStatus(),
                offer.getCreatedAt(),
                offer.getUpdatedAt()
        );
    }
}
