package com.smartek.trainingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "exam-service")
public interface ExamClient {
    
    @PostMapping("/api/exam-enrollments/unlock-exam")
    String unlockExamForTraining(@RequestParam Long userId, @RequestParam Long trainingId);
    
    @PostMapping("/api/exam-enrollments/lock-exam")
    String lockExamForTraining(@RequestParam Long userId, @RequestParam Long trainingId);
    
    @PostMapping("/api/exam-enrollments/enroll-exam")
    String enrollExamForTraining(@RequestParam Long userId, @RequestParam Long trainingId);
    
    @PostMapping("/api/exam-enrollments/enroll-quiz")
    String enrollQuizForCourse(@RequestParam Long userId, @RequestParam Long courseId);
    
    @DeleteMapping("/api/exams/by-training/{trainingId}")
    void deleteExamsByTrainingId(@PathVariable Long trainingId);
    
    @DeleteMapping("/api/exams/by-course/{courseId}")
    void deleteQuizzesByCourseId(@PathVariable Long courseId);
}
