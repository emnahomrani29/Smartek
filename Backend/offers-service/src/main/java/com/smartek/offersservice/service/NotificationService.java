package com.smartek.offersservice.service;

import com.smartek.offersservice.dto.NotificationResponse;
import com.smartek.offersservice.entity.Notification;
import com.smartek.offersservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final RestTemplate restTemplate;
    
    @Async
    @Transactional
    public void notifyLearnersAboutNewOffer(Long offerId, String offerTitle, String companyName) {
        log.info("Notifying learners about new offer: {}", offerTitle);
        
        try {
            // Récupérer tous les learners depuis le auth-service via Eureka
            String authServiceUrl = "http://auth-service/api/auth/users/role/LEARNER";
            log.info("Calling auth-service at: {}", authServiceUrl);
            
            Long[] learnerIds = restTemplate.getForObject(authServiceUrl, Long[].class);
            
            if (learnerIds != null && learnerIds.length > 0) {
                log.info("Found {} learners to notify", learnerIds.length);
                for (Long learnerId : learnerIds) {
                    Notification notification = new Notification();
                    notification.setUserId(learnerId);
                    notification.setUserRole("LEARNER");
                    notification.setType("NEW_OFFER");
                    notification.setTitle("Nouvelle offre d'emploi disponible");
                    notification.setMessage(String.format("Une nouvelle offre '%s' chez %s est maintenant disponible.", 
                            offerTitle, companyName));
                    notification.setRelatedOfferId(offerId);
                    notification.setIsRead(false);
                    
                    notificationRepository.save(notification);
                    log.info("Notification created for learner ID: {}", learnerId);
                }
                log.info("Successfully notified {} learners", learnerIds.length);
            } else {
                log.warn("No learners found to notify");
            }
        } catch (Exception e) {
            log.error("Error notifying learners about new offer: {}", e.getMessage(), e);
            // Ne pas propager l'exception pour ne pas bloquer la création de l'offre
        }
    }
    
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    private NotificationResponse mapToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getUserRole(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getRelatedOfferId(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}
