package com.smartek.authservice.controller;

import com.smartek.authservice.dto.AuthResponse;
import com.smartek.authservice.service.OAuth2Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
@Slf4j
public class OAuth2Controller {
    
    private final OAuth2Service oauth2Service;
    
    @GetMapping("/callback/{provider}")
    public String oauth2Callback(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestParam(required = false) String state) {
        
        log.info("OAuth2 callback reçu pour le provider: {}", provider);
        
        try {
            AuthResponse response = oauth2Service.handleOAuth2Callback(provider, code);
            
            // Encoder les paramètres pour éviter les erreurs URI malformed
            String encodedEmail = java.net.URLEncoder.encode(response.getEmail(), "UTF-8");
            String encodedFirstName = response.getFirstName() != null ? 
                java.net.URLEncoder.encode(response.getFirstName(), "UTF-8") : "";
            String encodedRole = java.net.URLEncoder.encode(response.getRole().toString(), "UTF-8");
            
            // Créer une page HTML qui redirige automatiquement
            String redirectUrl = String.format("http://localhost:4200/auth/oauth2/success?token=%s&userId=%d&email=%s&firstName=%s&role=%s",
                    response.getToken(),
                    response.getUserId(),
                    encodedEmail,
                    encodedFirstName,
                    encodedRole);
            
            log.info("Redirection vers: {}", redirectUrl);
            
            // Retourner une page HTML avec redirection JavaScript
            return "<!DOCTYPE html>" +
                   "<html>" +
                   "<head><title>Redirection...</title></head>" +
                   "<body>" +
                   "<p>Connexion réussie! Redirection en cours...</p>" +
                   "<script>window.location.href = '" + redirectUrl + "';</script>" +
                   "</body>" +
                   "</html>";
                    
        } catch (Exception e) {
            log.error("Erreur lors du callback OAuth2: {}", e.getMessage(), e);
            String errorMessage = java.net.URLEncoder.encode(e.getMessage(), java.nio.charset.StandardCharsets.UTF_8);
            String errorUrl = "http://localhost:4200/auth/sign-in?error=" + errorMessage;
            
            return "<!DOCTYPE html>" +
                   "<html>" +
                   "<head><title>Erreur</title></head>" +
                   "<body>" +
                   "<p>Erreur lors de la connexion. Redirection...</p>" +
                   "<script>window.location.href = '" + errorUrl + "';</script>" +
                   "</body>" +
                   "</html>";
        }
    }
}
