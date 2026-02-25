package com.smartek.certificationbadgeservice.controller;

import com.smartek.certificationbadgeservice.dto.BadgeTemplateDTO;
import com.smartek.certificationbadgeservice.service.BadgeTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing badge templates.
 * Provides endpoints for CRUD operations on badge templates.
 */
@RestController
@RequestMapping("/api/certifications-badges/badge-templates")
@RequiredArgsConstructor
@Slf4j
public class BadgeTemplateController {
    
    private final BadgeTemplateService badgeTemplateService;
    
    /**
     * Create a new badge template.
     * Only accessible by TRAINER and ADMIN roles.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<BadgeTemplateDTO> createBadgeTemplate(@Valid @RequestBody BadgeTemplateDTO badgeTemplateDTO) {
        log.info("Creating badge template with name: {}", badgeTemplateDTO.getName());
        BadgeTemplateDTO created = badgeTemplateService.create(badgeTemplateDTO);
        log.info("Badge template created with id: {}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Update an existing badge template.
     * Only accessible by TRAINER and ADMIN roles.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<BadgeTemplateDTO> updateBadgeTemplate(
            @PathVariable Long id,
            @Valid @RequestBody BadgeTemplateDTO badgeTemplateDTO) {
        log.info("Updating badge template with id: {}", id);
        BadgeTemplateDTO updated = badgeTemplateService.update(id, badgeTemplateDTO);
        log.info("Badge template updated with id: {}", id);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Get all badge templates.
     * Accessible by all authenticated users.
     */
    @GetMapping
    public ResponseEntity<List<BadgeTemplateDTO>> getAllBadgeTemplates() {
        log.info("Retrieving all badge templates");
        List<BadgeTemplateDTO> templates = badgeTemplateService.findAll();
        log.info("Retrieved {} badge templates", templates.size());
        return ResponseEntity.ok(templates);
    }
    
    /**
     * Get a specific badge template by ID.
     * Accessible by all authenticated users.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BadgeTemplateDTO> getBadgeTemplateById(@PathVariable Long id) {
        log.info("Retrieving badge template with id: {}", id);
        BadgeTemplateDTO template = badgeTemplateService.findById(id);
        return ResponseEntity.ok(template);
    }
    
    /**
     * Delete a badge template.
     * Only accessible by TRAINER and ADMIN roles.
     * Earned badges are preserved.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<Void> deleteBadgeTemplate(@PathVariable Long id) {
        log.info("Deleting badge template with id: {}", id);
        badgeTemplateService.delete(id);
        log.info("Badge template deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }
}
