package com.smartek.certificationbadgeservice.repository;

import com.smartek.certificationbadgeservice.entity.BadgeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeTemplateRepository extends JpaRepository<BadgeTemplate, Long> {
}
