package com.smartek.authservice.controller;

import com.smartek.authservice.dto.LearningStylePreferenceDto;
import com.smartek.authservice.service.LearningStyleService;
import com.smartek.authservice.service.JwtService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning-styles")
@RequiredArgsConstructor
public class LearningStyleController {

    private final LearningStyleService service;
    private final JwtService jwtService;

    private Long getCurrentUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUserId(token);
        }
        throw new IllegalStateException("Utilisateur non authentifié");
    }

    // CREATE - Créer les préférences
    @PostMapping
    public ResponseEntity<LearningStylePreferenceDto> create(
            HttpServletRequest request,
            @Valid @RequestBody LearningStylePreferenceDto dto) {
        Long userId = getCurrentUserId(request);
        LearningStylePreferenceDto created = service.create(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // READ - Lire les préférences
    @GetMapping
    public ResponseEntity<LearningStylePreferenceDto> getMyPreferences(
            HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        try {
            LearningStylePreferenceDto preferences = service.getByUserId(userId);
            return ResponseEntity.ok(preferences);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE - Mettre à jour les préférences
    @PutMapping
    public ResponseEntity<LearningStylePreferenceDto> update(
            HttpServletRequest request,
            @Valid @RequestBody LearningStylePreferenceDto dto) {
        Long userId = getCurrentUserId(request);
        LearningStylePreferenceDto updated = service.update(userId, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE (RESET) - Réinitialiser aux valeurs par défaut
    @DeleteMapping("/reset")
    public ResponseEntity<Void> resetToDefault(
            HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        service.resetToDefault(userId);
        return ResponseEntity.noContent().build();
    }

    // DELETE COMPLET - Supprimer les préférences
    @DeleteMapping
    public ResponseEntity<Void> delete(
            HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        service.delete(userId);
        return ResponseEntity.noContent().build();
    }
}
