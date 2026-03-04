package com.smartek.offersservice.repository;

import com.smartek.offersservice.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByOffer_Id(Long offerId);
    
    List<Application> findByLearnerId(Long learnerId);
    
    Optional<Application> findByOffer_IdAndLearnerId(Long offerId, Long learnerId);
    
    boolean existsByOffer_IdAndLearnerId(Long offerId, Long learnerId);
}
