package com.smartek.examservice.repository;

import com.smartek.examservice.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByExamId(Long examId);
    List<ExamResult> findByUserId(Long userId);
    List<ExamResult> findByExamIdAndUserId(Long examId, Long userId);
}
