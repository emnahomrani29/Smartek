package com.smartek.authservice.repository;

import com.smartek.authservice.entity.LearningStylePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningStylePreferenceRepository extends JpaRepository<LearningStylePreference, Long> {

    Optional<LearningStylePreference> findByUserUserId(Long userId);

    boolean existsByUserUserId(Long userId);
}
