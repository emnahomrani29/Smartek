package com.smartek.authservice.repository;

import com.smartek.authservice.entity.SkillEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillEvidenceRepository extends JpaRepository<SkillEvidence, Integer> {
    List<SkillEvidence> findByUserUserId(Integer userId);
}
