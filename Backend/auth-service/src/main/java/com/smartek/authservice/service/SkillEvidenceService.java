package com.smartek.authservice.service;

import com.smartek.authservice.dto.SkillEvidenceCreateDTO;
import com.smartek.authservice.dto.SkillEvidenceResponseDTO;
import com.smartek.authservice.entity.SkillEvidence;
import com.smartek.authservice.entity.User;
import com.smartek.authservice.repository.SkillEvidenceRepository;
import com.smartek.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillEvidenceService {

    private final SkillEvidenceRepository evidenceRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Long currentUserId) {
        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur connecté introuvable"));
    }

    private boolean isAdmin(User user) {
        return "ADMIN".equalsIgnoreCase(user.getRole().name());
    }

    private SkillEvidenceResponseDTO toResponseDTO(SkillEvidence e) {
        return SkillEvidenceResponseDTO.builder()
                .evidenceId(e.getEvidenceId())
                .title(e.getTitle())
                .description(e.getDescription())
                .fileUrl(e.getFileUrl())
                .uploadDate(e.getUploadDate())
                .userFirstName(e.getUser().getFirstName())
                .build();
    }

    private String detectType(String url) {
        if (url == null) return "UNKNOWN";
        String lower = url.toLowerCase();
        if (lower.contains("github.com")) return "GITHUB";
        if (lower.contains("youtube.com") || lower.contains("youtu.be")) return "VIDEO";
        if (lower.endsWith(".pdf")) return "PDF";
        if (lower.matches(".*\\.(jpg|jpeg|png|gif|webp)$")) return "IMAGE";
        return "LINK";
    }


    public List<SkillEvidenceResponseDTO> getMyEvidences(Long currentUserId) {
        return evidenceRepository.findByUserUserId(currentUserId.intValue())
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<SkillEvidenceResponseDTO> getAll(Long currentUserId) {
        User u = getCurrentUser(currentUserId);
        if (isAdmin(u)) {
            return evidenceRepository.findAll().stream().map(this::toResponseDTO).toList();
        }
        return getMyEvidences(currentUserId);
    }

    public SkillEvidenceResponseDTO getOne(Integer id, Long currentUserId) {
        SkillEvidence ev = evidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preuve non trouvée"));

        User u = getCurrentUser(currentUserId);
        if (!ev.getUser().getUserId().equals(currentUserId) && !isAdmin(u)) {
            throw new AccessDeniedException("Accès non autorisé");
        }
        return toResponseDTO(ev);
    }

    @Transactional
    public SkillEvidenceResponseDTO create(SkillEvidenceCreateDTO dto, Long currentUserId) {
        User user = getCurrentUser(currentUserId);

        SkillEvidence evidence = SkillEvidence.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .uploadDate(LocalDate.now())
                .user(user)
                .fileUrl(dto.getFileUrl())
                .build();

        evidence = evidenceRepository.save(evidence);
        return toResponseDTO(evidence);
    }

    @Transactional
    public SkillEvidenceResponseDTO update(Integer id, SkillEvidenceCreateDTO dto, Long currentUserId) {
        SkillEvidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preuve non trouvée"));

        User current = getCurrentUser(currentUserId);
        if (!evidence.getUser().getUserId().equals(currentUserId) && !isAdmin(current)) {
            throw new AccessDeniedException("Vous ne pouvez modifier que vos preuves");
        }

        evidence.setTitle(dto.getTitle());
        evidence.setDescription(dto.getDescription());
        if (dto.getFileUrl() != null && !dto.getFileUrl().isBlank()) {
            evidence.setFileUrl(dto.getFileUrl());
        }

        evidence = evidenceRepository.save(evidence);
        return toResponseDTO(evidence);
    }

    @Transactional
    public void delete(Integer id, Long currentUserId) {
        SkillEvidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preuve non trouvée"));

        User current = getCurrentUser(currentUserId);
        if (!evidence.getUser().getUserId().equals(currentUserId) && !isAdmin(current)) {
            throw new AccessDeniedException("Vous ne pouvez supprimer que vos preuves");
        }

        evidenceRepository.delete(evidence);
    }
}
