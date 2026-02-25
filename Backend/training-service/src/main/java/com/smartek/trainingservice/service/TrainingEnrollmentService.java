package com.smartek.trainingservice.service;

import com.smartek.trainingservice.client.ExamClient;
import com.smartek.trainingservice.dto.TrainingEnrollmentRequest;
import com.smartek.trainingservice.dto.TrainingEnrollmentResponse;
import com.smartek.trainingservice.entity.Training;
import com.smartek.trainingservice.entity.TrainingEnrollment;
import com.smartek.trainingservice.repository.TrainingRepository;
import com.smartek.trainingservice.repository.TrainingEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainingEnrollmentService {
    
    private final TrainingEnrollmentRepository enrollmentRepository;
    private final TrainingRepository trainingRepository;
    private final ExamClient examClient;
    
    @Transactional
    public TrainingEnrollmentResponse enrollUser(TrainingEnrollmentRequest request) {
        // Vérifier si l'utilisateur est déjà inscrit
        if (enrollmentRepository.existsByUserIdAndTrainingTrainingId(request.getUserId(), request.getTrainingId())) {
            throw new RuntimeException("L'utilisateur est déjà inscrit à cette formation");
        }
        
        // Récupérer la formation
        Training training = trainingRepository.findById(request.getTrainingId())
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Créer l'inscription
        TrainingEnrollment enrollment = TrainingEnrollment.builder()
                .training(training)
                .userId(request.getUserId())
                .build();
        
        TrainingEnrollment savedEnrollment = enrollmentRepository.save(enrollment);
        
        // Créer l'enrollment pour l'examen de la formation (verrouillé)
        try {
            log.info("Création de l'enrollment pour l'examen de la formation {} pour l'utilisateur {}", 
                    request.getTrainingId(), request.getUserId());
            examClient.enrollExamForTraining(request.getUserId(), request.getTrainingId());
            log.info("Enrollment d'examen créé avec succès");
        } catch (Exception e) {
            log.warn("Aucun examen trouvé pour cette formation ou erreur: {}", e.getMessage());
            // Ne pas bloquer l'inscription si aucun examen n'existe
        }
        
        // Créer les enrollments pour les quiz de tous les cours de la formation
        if (training.getCourseIds() != null && !training.getCourseIds().isEmpty()) {
            for (Long courseId : training.getCourseIds()) {
                try {
                    log.info("Création de l'enrollment pour le quiz du cours {} pour l'utilisateur {}", 
                            courseId, request.getUserId());
                    examClient.enrollQuizForCourse(request.getUserId(), courseId);
                } catch (Exception e) {
                    log.warn("Aucun quiz trouvé pour le cours {} ou erreur: {}", courseId, e.getMessage());
                    // Continuer même si un quiz n'existe pas
                }
            }
        }
        
        return mapToResponse(savedEnrollment);
    }
    
    public List<TrainingEnrollmentResponse> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TrainingEnrollmentResponse> getTrainingEnrollments(Long trainingId) {
        return enrollmentRepository.findByTrainingTrainingId(trainingId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void unenrollUser(Long userId, Long trainingId) {
        TrainingEnrollment enrollment = enrollmentRepository.findByUserIdAndTrainingTrainingId(userId, trainingId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        enrollmentRepository.delete(enrollment);
    }
    
    @Transactional
    public TrainingEnrollmentResponse updateProgress(Long userId, Long trainingId, int progress) {
        TrainingEnrollment enrollment = enrollmentRepository.findByUserIdAndTrainingTrainingId(userId, trainingId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        int oldProgress = enrollment.getProgress();
        enrollment.setProgress(progress);
        
        // Si la progression atteint 100%, marquer comme terminé et débloquer l'examen
        if (progress >= 100 && enrollment.getCompletedAt() == null) {
            enrollment.setCompletedAt(java.time.LocalDateTime.now());
            enrollment.setStatus("COMPLETED");
            
            // Débloquer l'examen final de la formation
            try {
                log.info("Formation terminée - Déblocage de l'examen pour userId={}, trainingId={}", userId, trainingId);
                examClient.unlockExamForTraining(userId, trainingId);
                log.info("Examen débloqué avec succès pour la formation {}", trainingId);
            } catch (Exception e) {
                log.error("Erreur lors du déblocage de l'examen: {}", e.getMessage());
                // Ne pas bloquer la progression même si le déblocage échoue
            }
        } 
        // Si la progression était à 100% et descend en dessous, reverrouiller l'examen
        else if (oldProgress >= 100 && progress < 100) {
            enrollment.setCompletedAt(null);
            enrollment.setStatus("IN_PROGRESS");
            
            // Reverrouiller l'examen
            try {
                log.info("Formation non terminée - Reverrouillage de l'examen pour userId={}, trainingId={}", userId, trainingId);
                examClient.lockExamForTraining(userId, trainingId);
                log.info("Examen reverrouillé avec succès pour la formation {}", trainingId);
            } catch (Exception e) {
                log.error("Erreur lors du reverrouillage de l'examen: {}", e.getMessage());
            }
        }
        else if (progress > 0 && progress < 100) {
            enrollment.setStatus("IN_PROGRESS");
        }
        
        TrainingEnrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        return mapToResponse(updatedEnrollment);
    }
    
    private TrainingEnrollmentResponse mapToResponse(TrainingEnrollment enrollment) {
        TrainingEnrollmentResponse response = new TrainingEnrollmentResponse();
        response.setId(enrollment.getId());
        response.setTrainingId(enrollment.getTraining().getTrainingId());
        response.setTrainingTitle(enrollment.getTraining().getTitle());
        response.setUserId(enrollment.getUserId());
        response.setEnrolledAt(enrollment.getEnrolledAt());
        response.setIsActive(enrollment.getIsActive());
        response.setProgress(enrollment.getProgress());
        response.setCompletedAt(enrollment.getCompletedAt());
        response.setStatus(enrollment.getStatus());
        return response;
    }

    public Boolean hasCompletedAllCourses(Long userId, Long trainingId) {
        TrainingEnrollment enrollment = enrollmentRepository.findByUserIdAndTrainingTrainingId(userId, trainingId)
                .orElse(null);
        
        if (enrollment == null) {
            return false; // Pas inscrit = pas complété
        }
        
        // Vérifier si la progression est à 100% ou si completedAt est défini
        return enrollment.getProgress() >= 100 || enrollment.getCompletedAt() != null;
    }
}
