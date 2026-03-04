# Guide de Démarrage des Services

## Erreur 503 Service Unavailable

Cette erreur signifie que le service `offers-service` n'est pas disponible ou n'est pas enregistré avec Eureka.

## Ordre de Démarrage des Services

### 1. Eureka Server (Port 8761)
```bash
cd Backend/eureka-server
mvn spring-boot:run
```
Attendez le message: `Started EurekaServerApplication`

### 2. Config Server (Port 8888) - Optionnel
```bash
cd Backend/config-server
mvn spring-boot:run
```

### 3. Auth Service (Port 8081)
```bash
cd Backend/auth-service
mvn spring-boot:run
```
Attendez le message: `Started AuthServiceApplication`

### 4. Offers Service (Port 8085) ⚠️ IMPORTANT
```bash
cd Backend/offers-service
mvn spring-boot:run
```
Attendez le message: `Started OffersServiceApplication`

**AVANT de démarrer offers-service:**
- ✅ Assurez-vous que MySQL est démarré
- ✅ Exécutez le script `fix-applications-table.sql` dans MySQL Workbench
- ✅ Vérifiez que la base de données `offers_db` existe

### 5. API Gateway (Port 8080)
```bash
cd Backend/api-gateway
mvn spring-boot:run
```
Attendez le message: `Started ApiGatewayApplication`

### 6. Autres Services (Optionnels)
```bash
# Course Service (Port 8082)
cd Backend/course-service
mvn spring-boot:run

# Exam Service (Port 8083)
cd Backend/exam-service
mvn spring-boot:run
```

## Vérification

### Exécutez le script de vérification:
```powershell
.\check-services.ps1
```

### Vérification manuelle:
1. **Eureka Dashboard**: http://localhost:8761
   - Vous devriez voir `OFFERS-SERVICE` dans la liste des instances
   
2. **Offers Service Health**: http://localhost:8085/actuator/health
   - Devrait retourner: `{"status":"UP"}`

3. **API Gateway Health**: http://localhost:8080/actuator/health
   - Devrait retourner: `{"status":"UP"}`

## Résolution des Problèmes

### Si offers-service ne démarre pas:

1. **Vérifiez les logs** pour voir l'erreur exacte
2. **Vérifiez MySQL**:
   ```sql
   -- Dans MySQL Workbench
   SHOW DATABASES;
   USE offers_db;
   SHOW TABLES;
   DESCRIBE applications;
   ```

3. **Vérifiez application.yml** dans `Backend/offers-service/src/main/resources/`
   - URL de la base de données
   - Nom d'utilisateur et mot de passe MySQL

4. **Erreur "Field 'created_at' doesn't have a default value"**:
   - Exécutez le script `fix-applications-table.sql`
   - Redémarrez offers-service

### Si l'erreur 503 persiste:

1. Vérifiez qu'Eureka affiche offers-service comme UP
2. Attendez 30 secondes après le démarrage (temps d'enregistrement)
3. Redémarrez l'API Gateway après offers-service

## Test Final

Une fois tous les services démarrés:
1. Allez sur http://localhost:4200
2. Connectez-vous en tant que LEARNER
3. Allez dans "Offres d'Emploi"
4. Cliquez sur "Voir Détails" d'une offre
5. Soumettez une candidature

**Résultat attendu**: Candidature soumise avec succès ✅
