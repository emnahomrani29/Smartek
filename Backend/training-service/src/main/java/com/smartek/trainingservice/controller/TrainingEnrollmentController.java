package com.smartek.trainingservice.controller;

import com.smartek.trainingservice.dto.TrainingEnrollmentRequest;
import com.smartek.trainingservice.dto.TrainingEnrollmentResponse;
import com.smartek.trainingservice.service.TrainingEnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trainings/enrollments")
@RequiredArgsConstructor
public class TrainingEnrollmentController {
    
    private final TrainingEnrollmentService enrollmentService;
    
    @PostMapping
    public ResponseEntity<TrainingEnrollmentResponse> enrollUser(@RequestBody TrainingEnrollmentRequest request) {
        try {
            TrainingEnrollmentResponse response = enrollmentService.enrollUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainingEnrollmentResponse>> getUserEnrollments(@PathVariable Long userId) {
        List<TrainingEnrollmentResponse> enrollments = enrollmentService.getUserEnrollments(userId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/training/{trainingId}")
    public ResponseEntity<List<TrainingEnrollmentResponse>> getTrainingEnrollments(@PathVariable Long trainingId) {
        List<TrainingEnrollmentResponse> enrollments = enrollmentService.getTrainingEnrollments(trainingId);
        return ResponseEntity.ok(enrollments);
    }
    
    @DeleteMapping("/user/{userId}/training/{trainingId}")
    public ResponseEntity<Void> unenrollUser(@PathVariable Long userId, @PathVariable Long trainingId) {
        try {
            enrollmentService.unenrollUser(userId, trainingId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/user/{userId}/training/{trainingId}/progress")
    public ResponseEntity<TrainingEnrollmentResponse> updateProgress(
            @PathVariable Long userId, 
            @PathVariable Long trainingId,
            @RequestBody ProgressUpdateRequest request) {
        try {
            TrainingEnrollmentResponse response = enrollmentService.updateProgress(userId, trainingId, request.getProgress());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check-completion")
    public ResponseEntity<Boolean> hasCompletedAllCourses(
            @RequestParam Long userId, 
            @RequestParam Long trainingId) {
        Boolean hasCompleted = enrollmentService.hasCompletedAllCourses(userId, trainingId);
        return ResponseEntity.ok(hasCompleted);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Training Service is running");
    }
}

class ProgressUpdateRequest {
    private int progress;
    
    public int getProgress() {
        return progress;
    }
    
    public void setProgress(int progress) {
        this.progress = progress;
    }
}
