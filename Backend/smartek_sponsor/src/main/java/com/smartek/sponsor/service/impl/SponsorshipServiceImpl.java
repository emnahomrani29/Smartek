package com.smartek.sponsor.service.impl;

import com.smartek.sponsor.entity.Contract;
import com.smartek.sponsor.entity.Sponsorship;
import com.smartek.sponsor.exception.ResourceNotFoundException;
import com.smartek.sponsor.repository.ContractRepository;
import com.smartek.sponsor.repository.SponsorshipRepository;
import com.smartek.sponsor.service.SponsorshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SponsorshipServiceImpl implements SponsorshipService {
    private final SponsorshipRepository sponsorshipRepository;
    private final ContractRepository contractRepository;

    @Override
    public Sponsorship createSponsorship(Long contractId, Sponsorship sponsorship) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", contractId));
        sponsorship.setId(null);
        sponsorship.setContract(contract);
        return sponsorshipRepository.save(sponsorship);
    }

    @Override
    public List<Sponsorship> getAllSponsorships() {
        return sponsorshipRepository.findAll();
    }

    @Override
    public Sponsorship getSponsorshipById(Long sponsorshipId) {
        return sponsorshipRepository.findById(sponsorshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Sponsorship", "id", sponsorshipId));
    }

    @Override
    public Sponsorship updateSponsorship(Long sponsorshipId, Long contractId, Sponsorship sponsorship) {
        Sponsorship existing = getSponsorshipById(sponsorshipId);
        existing.setSponsorshipType(sponsorship.getSponsorshipType());
        existing.setAmountAllocated(sponsorship.getAmountAllocated());
        existing.setStartDate(sponsorship.getStartDate());
        existing.setEndDate(sponsorship.getEndDate());
        existing.setVisibilityLevel(sponsorship.getVisibilityLevel());
        existing.setTargetType(sponsorship.getTargetType());
        existing.setTargetId(sponsorship.getTargetId());

        if (contractId != null) {
            Contract contract = contractRepository.findById(contractId)
                    .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", contractId));
            existing.setContract(contract);
        }

        return sponsorshipRepository.save(existing);
    }

    @Override
    public void deleteSponsorship(Long sponsorshipId) {
        Sponsorship existing = getSponsorshipById(sponsorshipId);
        sponsorshipRepository.delete(existing);
    }
}

