package com.smartek.sponsor.repository;

import com.smartek.sponsor.entity.Sponsorship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {
    List<Sponsorship> findByContractSponsorId(Long sponsorId);
}

