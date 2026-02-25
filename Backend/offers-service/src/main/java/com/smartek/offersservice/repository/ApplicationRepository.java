package com.smartek.offersservice.repository;

import com.smartek.offersservice.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByOfferId(Long offerId);
    
    List<Application> findByLearnerId(Long learnerId);
    
    Optional<Application> findByOfferIdAndLearnerId(Long offerId, Long learnerId);
    
    boolean existsByOfferIdAndLearnerId(Long offerId, Long learnerId);
}
