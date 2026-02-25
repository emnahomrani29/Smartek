package com.smartek.authservice.service;

import com.smartek.authservice.dto.LearningStylePreferenceDto;
import com.smartek.authservice.entity.LearningStylePreference;
import com.smartek.authservice.entity.User;
import com.smartek.authservice.enums.LearningStyleType;
import com.smartek.authservice.repository.LearningStylePreferenceRepository;
import com.smartek.authservice.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LearningStyleService {

    private final LearningStylePreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    @Transactional
    public LearningStylePreferenceDto create(Long userId, LearningStylePreferenceDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        // Vérifier si l'utilisateur a déjà des préférences
        if (preferenceRepository.existsByUserUserId(userId)) {
            throw new IllegalStateException("L'utilisateur a déjà des préférences");
        }

        LearningStylePreference preference = LearningStylePreference.builder()
                .user(user)
                .preferredStyle(dto.getPreferredStyle())
                .videoPreferred(dto.getVideoPreferred() != null ? dto.getVideoPreferred() : false)
                .textPreferred(dto.getTextPreferred() != null ? dto.getTextPreferred() : false)
                .practicalWorkPreferred(dto.getPracticalWorkPreferred() != null ? dto.getPracticalWorkPreferred() : false)
                .build();

        preference = preferenceRepository.save(preference);
        return toDto(preference);
    }

    @Transactional(readOnly = true)
    public LearningStylePreferenceDto getByUserId(Long userId) {
        LearningStylePreference preference = preferenceRepository.findByUserUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Aucune préférence trouvée pour cet utilisateur"));
        return toDto(preference);
    }

    @Transactional
    public LearningStylePreferenceDto update(Long userId, LearningStylePreferenceDto dto) {
        LearningStylePreference preference = preferenceRepository.findByUserUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Aucune préférence trouvée pour cet utilisateur"));

        preference.setPreferredStyle(dto.getPreferredStyle());
        preference.setVideoPreferred(dto.getVideoPreferred() != null ? dto.getVideoPreferred() : false);
        preference.setTextPreferred(dto.getTextPreferred() != null ? dto.getTextPreferred() : false);
        preference.setPracticalWorkPreferred(dto.getPracticalWorkPreferred() != null ? dto.getPracticalWorkPreferred() : false);

        preference = preferenceRepository.save(preference);
        return toDto(preference);
    }

    @Transactional
    public void resetToDefault(Long userId) {
        LearningStylePreference preference = preferenceRepository.findByUserUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Aucune préférence trouvée pour cet utilisateur"));

        // Réinitialiser aux valeurs par défaut
        preference.setPreferredStyle(LearningStyleType.VISUAL);
        preference.setVideoPreferred(true);
        preference.setTextPreferred(false);
        preference.setPracticalWorkPreferred(false);

        preferenceRepository.save(preference);
    }

    @Transactional
    public void delete(Long userId) {
        LearningStylePreference preference = preferenceRepository.findByUserUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Aucune préférence trouvée pour cet utilisateur"));
        preferenceRepository.delete(preference);
    }

    private LearningStylePreferenceDto toDto(LearningStylePreference preference) {
        return LearningStylePreferenceDto.builder()
                .preferredStyle(preference.getPreferredStyle())
                .videoPreferred(preference.getVideoPreferred())
                .textPreferred(preference.getTextPreferred())
                .practicalWorkPreferred(preference.getPracticalWorkPreferred())
                .build();
    }
}
