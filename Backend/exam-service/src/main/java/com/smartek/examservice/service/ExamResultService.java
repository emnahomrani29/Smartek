package com.smartek.examservice.service;

import com.smartek.examservice.dto.*;
import com.smartek.examservice.entity.*;
import com.smartek.examservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultService {
    private final ExamResultRepository examResultRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final ExamEnrollmentRepository examEnrollmentRepository;

    @Transactional
    public ExamResultResponse submitExam(ExamSubmissionDTO request) {
        System.out.println("=== SUBMIT EXAM DEBUG ===");
        System.out.println("Exam ID: " + request.getExamId());
        System.out.println("User ID: " + request.getUserId());
        System.out.println("Answers count: " + (request.getAnswers() != null ? request.getAnswers().size() : 0));
        
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        System.out.println("Exam found: " + exam.getTitle());
        System.out.println("Total marks: " + exam.getTotalMarks());

        // Calculer le temps pris (durée de l'examen - temps restant)
        Integer timeTaken = request.getTimeTaken() != null ? request.getTimeTaken() : exam.getDuration();

        ExamResult result = new ExamResult();
        result.setExam(exam);
        result.setUserId(request.getUserId());
        result.setTotalMarks(exam.getTotalMarks());
        result.setTimeTaken(timeTaken);
        result.setSubmittedAt(LocalDateTime.now());
        result.setIsCorrected(true); // Auto-corrigé pour les QCM

        int obtainedMarks = 0;
        List<UserAnswer> userAnswers = request.getAnswers().stream()
                .map(ansReq -> {
                    Question question = questionRepository.findById(ansReq.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found"));

                    System.out.println("Processing question: " + question.getId() + " - " + question.getQuestionText());

                    UserAnswer userAnswer = new UserAnswer();
                    userAnswer.setExamResult(result);
                    userAnswer.setQuestionId(ansReq.getQuestionId());
                    userAnswer.setAnswer(ansReq.getSelectedAnswer());

                    // Vérifier la réponse
                    boolean isCorrect = checkAnswer(question, ansReq);
                    userAnswer.setIsCorrect(isCorrect);
                    userAnswer.setMarksObtained(isCorrect ? question.getMarks() : 0);

                    System.out.println("Answer correct: " + isCorrect + ", Marks: " + userAnswer.getMarksObtained());

                    return userAnswer;
                })
                .collect(Collectors.toList());

        obtainedMarks = userAnswers.stream()
                .mapToInt(UserAnswer::getMarksObtained)
                .sum();

        System.out.println("Total obtained marks: " + obtainedMarks);

        result.setObtainedMarks(obtainedMarks);
        result.setPercentage((double) obtainedMarks / exam.getTotalMarks() * 100);
        result.setPassed(result.getPercentage() >= exam.getPassingScore());
        result.setUserAnswers(userAnswers);

        ExamResult savedResult = examResultRepository.save(result);
        
        System.out.println("Result saved with ID: " + savedResult.getId());
        
        // Marquer l'enrollment comme complété
        examEnrollmentRepository.findByUserIdAndExamId(request.getUserId(), exam.getId())
                .ifPresent(enrollment -> {
                    System.out.println("Marking enrollment as completed");
                    enrollment.setIsCompleted(true);
                    enrollment.setCompletedAt(LocalDateTime.now());
                    examEnrollmentRepository.save(enrollment);
                });

        System.out.println("=== END SUBMIT EXAM DEBUG ===");
        
        return mapToResultResponse(savedResult);
    }

    @Transactional
    public ExamResultResponse submitExamOld(ExamSubmissionRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        ExamResult result = new ExamResult();
        result.setExam(exam);
        result.setUserId(request.getUserId());
        result.setTotalMarks(exam.getTotalMarks());
        result.setTimeTaken(request.getTimeTaken());

        int obtainedMarks = 0;
        List<UserAnswer> userAnswers = request.getAnswers().stream()
                .map(ansReq -> {
                    Question question = questionRepository.findById(ansReq.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found"));

                    UserAnswer userAnswer = new UserAnswer();
                    userAnswer.setExamResult(result);
                    userAnswer.setQuestionId(ansReq.getQuestionId());
                    userAnswer.setAnswer(ansReq.getAnswer());

                    boolean isCorrect = checkAnswerOld(question, ansReq.getAnswer());
                    userAnswer.setIsCorrect(isCorrect);
                    userAnswer.setMarksObtained(isCorrect ? question.getMarks() : 0);

                    return userAnswer;
                })
                .collect(Collectors.toList());

        obtainedMarks = userAnswers.stream()
                .mapToInt(UserAnswer::getMarksObtained)
                .sum();

        result.setObtainedMarks(obtainedMarks);
        result.setPercentage((double) obtainedMarks / exam.getTotalMarks() * 100);
        result.setPassed(obtainedMarks >= exam.getPassingScore());
        result.setUserAnswers(userAnswers);

        ExamResult savedResult = examResultRepository.save(result);
        return mapToResultResponse(savedResult);
    }

    public List<ExamResultResponse> getResultsByUser(Long userId) {
        return examResultRepository.findByUserId(userId).stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResultResponse> getResultsByExam(Long examId) {
        return examResultRepository.findByExamId(examId).stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    private boolean checkAnswer(Question question, ExamSubmissionDTO.AnswerDTO answerDTO) {
        if ("MULTIPLE_CHOICE".equals(question.getQuestionType()) || "TRUE_FALSE".equals(question.getQuestionType())) {
            // Pour les QCM, vérifier que toutes les bonnes réponses sont sélectionnées
            if (answerDTO.getSelectedOptions() == null || answerDTO.getSelectedOptions().isEmpty()) {
                return false;
            }
            
            List<QuestionOption> options = question.getOptions();
            if (options == null || options.isEmpty()) {
                return false;
            }
            
            // Compter les bonnes réponses attendues
            long expectedCorrectCount = options.stream().filter(QuestionOption::getIsCorrect).count();
            
            // Vérifier que le nombre de réponses sélectionnées correspond
            if (answerDTO.getSelectedOptions().size() != expectedCorrectCount) {
                return false;
            }
            
            // Vérifier que toutes les options sélectionnées sont correctes
            for (Integer optionIndex : answerDTO.getSelectedOptions()) {
                if (optionIndex < 0 || optionIndex >= options.size()) {
                    return false;
                }
                if (!options.get(optionIndex).getIsCorrect()) {
                    return false;
                }
            }
            
            return true;
        } else if ("SHORT_ANSWER".equals(question.getQuestionType())) {
            // Pour les réponses courtes, comparer avec la réponse correcte
            return question.getCorrectAnswer() != null && 
                   question.getCorrectAnswer().trim().equalsIgnoreCase(answerDTO.getSelectedAnswer().trim());
        }
        
        return false;
    }

    private boolean checkAnswerOld(Question question, String userAnswer) {
        if ("MULTIPLE_CHOICE".equals(question.getQuestionType())) {
            return question.getOptions().stream()
                    .anyMatch(opt -> opt.getIsCorrect() && opt.getOptionText().equals(userAnswer));
        }
        return question.getCorrectAnswer() != null && 
               question.getCorrectAnswer().equalsIgnoreCase(userAnswer);
    }

    private ExamResultResponse mapToResultResponse(ExamResult result) {
        ExamResultResponse response = new ExamResultResponse();
        response.setId(result.getId());
        response.setExamId(result.getExam().getId());
        response.setExamTitle(result.getExam().getTitle());
        response.setUserId(result.getUserId());
        response.setObtainedMarks(result.getObtainedMarks());
        response.setTotalMarks(result.getTotalMarks());
        response.setPercentage(result.getPercentage());
        response.setPassed(result.getPassed());
        response.setSubmittedAt(result.getSubmittedAt());
        response.setTimeTaken(result.getTimeTaken());
        response.setIsCorrected(result.getIsCorrected());
        return response;
    }
}
