package com.smartek.offersservice.repository;

import com.smartek.offersservice.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    
    List<Interview> findByApplication_Offer_Id(Long offerId);
    
    List<Interview> findByLearnerId(Long learnerId);
    
    List<Interview> findByApplication_Id(Long applicationId);
    
    Optional<Interview> findByApplication_IdAndStatus(Long applicationId, Interview.InterviewStatus status);
    
    List<Interview> findByCreatedBy(Long createdBy);
}
