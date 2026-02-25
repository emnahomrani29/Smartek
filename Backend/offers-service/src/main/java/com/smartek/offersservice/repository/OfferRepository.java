package com.smartek.offersservice.repository;

import com.smartek.offersservice.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    
    List<Offer> findByCompanyId(Long companyId);
    
    List<Offer> findByStatus(String status);
    
    List<Offer> findByCompanyIdAndStatus(Long companyId, String status);
}
