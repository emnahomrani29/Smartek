package com.smartek.offersservice.controller;

import com.smartek.offersservice.dto.OfferRequest;
import com.smartek.offersservice.dto.OfferResponse;
import com.smartek.offersservice.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {
    
    private final OfferService offerService;
    
    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@Valid @RequestBody OfferRequest request) {
        OfferResponse response = offerService.createOffer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<OfferResponse>> getAllOffers() {
        List<OfferResponse> offers = offerService.getAllOffers();
        return ResponseEntity.ok(offers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long id) {
        OfferResponse offer = offerService.getOfferById(id);
        return ResponseEntity.ok(offer);
    }
    
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<OfferResponse>> getOffersByCompanyId(@PathVariable Long companyId) {
        List<OfferResponse> offers = offerService.getOffersByCompanyId(companyId);
        return ResponseEntity.ok(offers);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OfferResponse>> getOffersByStatus(@PathVariable String status) {
        List<OfferResponse> offers = offerService.getOffersByStatus(status);
        return ResponseEntity.ok(offers);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OfferResponse> updateOffer(
            @PathVariable Long id,
            @Valid @RequestBody OfferRequest request) {
        OfferResponse response = offerService.updateOffer(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Offers Service is running!");
    }
}
