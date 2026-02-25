package com.smartek.examservice.repository;

import com.smartek.examservice.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseId(Long courseId);
    List<Exam> findByTrainingId(Long trainingId);
    Optional<Exam> findFirstByCourseId(Long courseId);
    Optional<Exam> findFirstByCourseIdAndExamType(Long courseId, String examType);
    Optional<Exam> findFirstByTrainingIdAndExamType(Long trainingId, String examType);
    List<Exam> findByIsActive(Boolean isActive);
}
