package com.smartek.certificationbadgeservice.repository;

import com.smartek.certificationbadgeservice.entity.EarnedCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EarnedCertificationRepository extends JpaRepository<EarnedCertification, Long> {
    
    /**
     * Find all certifications earned by a specific learner
     * @param learnerId the learner ID
     * @return list of earned certifications
     */
    List<EarnedCertification> findByLearnerId(Long learnerId);
    
    /**
     * Count the number of times a certification template has been awarded
     * @param certificationTemplateId the certification template ID
     * @return count of awards
     */
    long countByCertificationTemplateId(Long certificationTemplateId);
    
    /**
     * Count active certifications for a learner (not expired)
     * @param learnerId the learner ID
     * @param currentDate the current date to compare against expiry dates
     * @return count of active certifications
     */
    long countByLearnerIdAndExpiryDateAfter(Long learnerId, LocalDate currentDate);
}
