package com.smartek.trainingservice.repository;

import com.smartek.trainingservice.entity.TrainingEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingEnrollmentRepository extends JpaRepository<TrainingEnrollment, Long> {
    List<TrainingEnrollment> findByUserId(Long userId);
    List<TrainingEnrollment> findByTrainingTrainingId(Long trainingId);
    Optional<TrainingEnrollment> findByUserIdAndTrainingTrainingId(Long userId, Long trainingId);
    boolean existsByUserIdAndTrainingTrainingId(Long userId, Long trainingId);
    void deleteByTrainingTrainingId(Long trainingId);
}
