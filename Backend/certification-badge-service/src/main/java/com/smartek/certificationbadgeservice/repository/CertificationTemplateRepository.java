package com.smartek.certificationbadgeservice.repository;

import com.smartek.certificationbadgeservice.entity.CertificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationTemplateRepository extends JpaRepository<CertificationTemplate, Long> {
}
