package com.smartek.authservice.service;

import com.smartek.authservice.dto.AuthResponse;
import com.smartek.authservice.entity.User;
import com.smartek.authservice.enums.RoleType;
import com.smartek.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2Service {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;
    
    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;
    
    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String githubClientSecret;
    
    @Transactional
    public AuthResponse handleOAuth2Callback(String provider, String code) {
        log.info("Traitement du callback OAuth2 pour: {}", provider);
        
        Map<String, String> userInfo;
        
        if ("google".equalsIgnoreCase(provider)) {
            userInfo = getGoogleUserInfo(code);
        } else if ("github".equalsIgnoreCase(provider)) {
            userInfo = getGithubUserInfo(code);
        } else {
            throw new RuntimeException("Provider OAuth2 non supporté: " + provider);
        }
        
        String email = userInfo.get("email");
        String firstName = userInfo.get("name");
        
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email non fourni par le provider OAuth2");
        }
        
        // Chercher ou créer l'utilisateur
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createOAuth2User(email, firstName, provider));
        
        // Générer le token JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getUserId());
        claims.put("oauth2Provider", provider);
        
        String token = jwtService.generateToken(user.getEmail(), claims);
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .role(user.getRole())
                .imageBase64(convertBytesToBase64(user.getImage()))
                .experience(user.getExperience())
                .message("Connexion OAuth2 réussie")
                .build();
    }
    
    private Map<String, String> getGoogleUserInfo(String code) {
        try {
            // Échanger le code contre un access token
            String tokenUrl = "https://oauth2.googleapis.com/token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            String body = String.format(
                    "code=%s&client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code",
                    code, googleClientId, googleClientSecret,
                    "http://localhost:8081/api/auth/oauth2/callback/google"
            );
            
            HttpEntity<String> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            String accessToken = (String) tokenResponse.getBody().get("access_token");
            
            // Récupérer les informations utilisateur
            String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            
            HttpEntity<?> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, userRequest, Map.class
            );
            
            Map<String, Object> userBody = userResponse.getBody();
            Map<String, String> result = new HashMap<>();
            result.put("email", (String) userBody.get("email"));
            result.put("name", (String) userBody.get("name"));
            
            return result;
            
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des infos Google: {}", e.getMessage());
            throw new RuntimeException("Échec de l'authentification Google");
        }
    }
    
    private Map<String, String> getGithubUserInfo(String code) {
        try {
            // Échanger le code contre un access token
            String tokenUrl = "https://github.com/login/oauth/access_token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            
            Map<String, String> tokenRequest = new HashMap<>();
            tokenRequest.put("client_id", githubClientId);
            tokenRequest.put("client_secret", githubClientSecret);
            tokenRequest.put("code", code);
            tokenRequest.put("redirect_uri", "http://localhost:8081/api/auth/oauth2/callback/github");
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(tokenRequest, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            String accessToken = (String) tokenResponse.getBody().get("access_token");
            
            // Récupérer les informations utilisateur
            String userInfoUrl = "https://api.github.com/user";
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            
            HttpEntity<?> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userResponse = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, userRequest, Map.class
            );
            
            Map<String, Object> userBody = userResponse.getBody();
            
            // GitHub peut ne pas fournir l'email publiquement, il faut le demander séparément
            String email = (String) userBody.get("email");
            if (email == null) {
                String emailUrl = "https://api.github.com/user/emails";
                ResponseEntity<List> emailResponse = restTemplate.exchange(
                        emailUrl, HttpMethod.GET, userRequest, List.class
                );
                
                List<Map<String, Object>> emails = emailResponse.getBody();
                if (emails != null && !emails.isEmpty()) {
                    for (Map<String, Object> emailObj : emails) {
                        if (Boolean.TRUE.equals(emailObj.get("primary"))) {
                            email = (String) emailObj.get("email");
                            break;
                        }
                    }
                    if (email == null) {
                        email = (String) emails.get(0).get("email");
                    }
                }
            }
            
            Map<String, String> result = new HashMap<>();
            result.put("email", email);
            result.put("name", (String) userBody.get("name"));
            
            return result;
            
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des infos GitHub: {}", e.getMessage());
            throw new RuntimeException("Échec de l'authentification GitHub");
        }
    }
    
    private User createOAuth2User(String email, String firstName, String provider) {
        log.info("Création d'un nouvel utilisateur OAuth2: {}", email);
        
        // Générer un mot de passe aléatoire (non utilisé pour OAuth2)
        String randomPassword = UUID.randomUUID().toString();
        
        User user = User.builder()
                .email(email)
                .firstName(firstName != null ? firstName : email.split("@")[0])
                .password(passwordEncoder.encode(randomPassword))
                .role(RoleType.LEARNER) // Rôle par défaut
                .experience(0)
                .build();
        
        return userRepository.save(user);
    }
    
    private String convertBytesToBase64(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(bytes);
    }
}
