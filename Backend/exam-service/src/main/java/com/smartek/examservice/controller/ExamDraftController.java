package com.smartek.examservice.controller;

import com.smartek.examservice.dto.ExamDraftDTO;
import com.smartek.examservice.service.ExamDraftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exam-drafts")
@RequiredArgsConstructor
public class ExamDraftController {
    private final ExamDraftService examDraftService;

    @PostMapping("/save")
    public ResponseEntity<String> saveDraft(@RequestBody ExamDraftDTO draftDTO) {
        examDraftService.saveDraft(draftDTO);
        return ResponseEntity.ok("Brouillon sauvegardé");
    }

    @GetMapping("/{examId}/user/{userId}")
    public ResponseEntity<ExamDraftDTO> getDraft(
            @PathVariable Long examId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(examDraftService.getDraft(examId, userId));
    }

    @DeleteMapping("/{examId}/user/{userId}")
    public ResponseEntity<String> deleteDraft(
            @PathVariable Long examId,
            @PathVariable Long userId) {
        examDraftService.deleteDraft(examId, userId);
        return ResponseEntity.ok("Brouillon supprimé");
    }
}
