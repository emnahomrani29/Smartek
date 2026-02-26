package com.smartek.sponsor.controller;

import com.smartek.sponsor.entity.Sponsorship;
import com.smartek.sponsor.service.SponsorshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sponsorships")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SponsorshipController {
    private final SponsorshipService sponsorshipService;

    @PostMapping
    public ResponseEntity<Sponsorship> createSponsorship(
            @RequestParam("contractId") Long contractId,
            @RequestBody Sponsorship sponsorship) {
        Sponsorship created = sponsorshipService.createSponsorship(contractId, sponsorship);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Sponsorship>> getAllSponsorships() {
        return ResponseEntity.ok(sponsorshipService.getAllSponsorships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sponsorship> getSponsorshipById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(sponsorshipService.getSponsorshipById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sponsorship> updateSponsorship(
            @PathVariable("id") Long id,
            @RequestParam(value = "contractId", required = false) Long contractId,
            @RequestBody Sponsorship sponsorship) {
        return ResponseEntity.ok(sponsorshipService.updateSponsorship(id, contractId, sponsorship));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSponsorship(@PathVariable("id") Long id) {
        sponsorshipService.deleteSponsorship(id);
        return ResponseEntity.noContent().build();
    }
}

