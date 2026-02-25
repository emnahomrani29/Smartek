package com.smartek.authservice.controller;

import com.smartek.authservice.dto.SkillEvidenceCreateDTO;
import com.smartek.authservice.dto.SkillEvidenceResponseDTO;
import com.smartek.authservice.service.SkillEvidenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import com.smartek.authservice.service.JwtService;

@RestController
@RequestMapping("/api/skill-evidence")
@RequiredArgsConstructor
@Validated
@Slf4j
public class SkillEvidenceController {

    private final SkillEvidenceService skillEvidenceService;
    private final JwtService jwtService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Utilisateur non authentifié");
        }

        // attempt from authentication details (populated by filter)
        Object details = authentication.getDetails();
        if (details instanceof java.util.Map<?, ?> map && map.containsKey("userId")) {
            return Long.valueOf(map.get("userId").toString());
        }

        // fallback: parse JWT from credentials or header
        String token = null;
        if (authentication.getCredentials() instanceof String cred && cred.startsWith("ey")) {
            token = cred;
        } else {
            // header approach
            var attrs = (org.springframework.web.context.request.ServletRequestAttributes)
                    org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                String header = attrs.getRequest().getHeader("Authorization");
                if (header != null && header.startsWith("Bearer ")) {
                    token = header.substring(7);
                }
            }
        }

        if (token != null) {
            Object idClaim = jwtService.extractClaim(token, claims -> claims.get("userId"));
            if (idClaim != null) {
                return Long.valueOf(idClaim.toString());
            }
        }

        throw new IllegalStateException("Impossible de récupérer l'ID utilisateur depuis le token");
    }


    @GetMapping
    public ResponseEntity<List<SkillEvidenceResponseDTO>> getAll(jakarta.servlet.http.HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("GET /api/skill-evidence called. Auth present: {}, name: {}, authorities: {}, details: {}",
                authentication != null && authentication.isAuthenticated(),
                authentication != null ? authentication.getName() : null,
                authentication != null ? authentication.getAuthorities() : null,
                authentication != null ? authentication.getDetails() : null);

        String authHeader = request.getHeader("Authorization");
        log.info("Authorization header present: {}", authHeader != null ? "yes" : "no");

        Long userId = getCurrentUserId();
        // for admins we want all records, otherwise just the user's own
        List<SkillEvidenceResponseDTO> evidences = skillEvidenceService.getAll(userId);
        return ResponseEntity.ok(evidences);
    }


    @GetMapping("/my")
    public ResponseEntity<List<SkillEvidenceResponseDTO>> getMyEvidences() {
        Long userId = getCurrentUserId();
        List<SkillEvidenceResponseDTO> evidences = skillEvidenceService.getMyEvidences(userId);
        return ResponseEntity.ok(evidences);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SkillEvidenceResponseDTO> getOne(@PathVariable Integer id) {
        Long userId = getCurrentUserId();
        SkillEvidenceResponseDTO dto = skillEvidenceService.getOne(id, userId);
        return ResponseEntity.ok(dto);
    }


    @PostMapping
    public ResponseEntity<SkillEvidenceResponseDTO> create(
            @Valid @RequestBody SkillEvidenceCreateDTO dto) {
        Long userId = getCurrentUserId(); // ta méthode
        return ResponseEntity.status(201).body(skillEvidenceService.create(dto, userId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<SkillEvidenceResponseDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody SkillEvidenceCreateDTO dto) {

        Long userId = getCurrentUserId();
        SkillEvidenceResponseDTO updated = skillEvidenceService.update(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        Long userId = getCurrentUserId();
        skillEvidenceService.delete(id, userId);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillEvidenceResponseDTO>> searchByTitle(
            @RequestParam String title) {
        return ResponseEntity.ok(List.of());
    }
}
