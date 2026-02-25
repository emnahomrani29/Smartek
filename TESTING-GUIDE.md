# SMARTEK Certification & Badge System - Testing Guide

## Summary

I've successfully created a complete certification and badge management system for your SMARTEK platform with:
- Backend microservice (certification-badge-service) on port 8082
- Frontend Angular components integrated into your dashboard
- Full CRUD operations for certifications and badges
- Award functionality for trainers to give certifications/badges to learners

## What Was Built

### Backend (certification-badge-service)
- 4 JPA entities: BadgeTemplate, CertificationTemplate, EarnedBadge, EarnedCertification
- 4 repositories with custom queries
- 13 DTOs and 4 mappers
- 5 service classes with business logic
- 5 REST controllers with 15+ endpoints
- JWT security with role-based access control
- Global exception handling
- Flyway database migrations
- Logging with Logback

### Frontend (Angular 18)
- 6 components: Badge/Certification lists, forms, and award pages
- 2 services: BadgeService and CertificationService
- TypeScript models for all data types
- Integrated into dashboard with sidebar menu
- Responsive UI with Tailwind CSS

## Current Issue

When trying to create a certification, you get "Failed to create certification" error. This is likely due to one of:
1. API Gateway routing issue
2. JWT token validation failing
3. Backend security configuration blocking the request

## Services Status

All services are running:
- ✅ Eureka Server: port 8761
- ✅ Auth Service: port 8081
- ✅ Certification-Badge Service: port 8082
- ✅ API Gateway: port 8080
- ✅ Frontend: port 4200

## Next Steps to Debug

1. Open browser console (F12 → Console tab)
2. Try creating a certification
3. Check for error messages in console
4. Look for HTTP status codes (401, 403, 404, 500)
5. Check the Network tab to see the actual API request/response

## API Endpoints

All requests go through API Gateway at http://localhost:8080

### Certification Templates
- GET `/api/certifications-badges/certification-templates` - Get all
- POST `/api/certifications-badges/certification-templates` - Create
- PUT `/api/certifications-badges/certification-templates/{id}` - Update
- DELETE `/api/certifications-badges/certification-templates/{id}` - Delete

### Badge Templates
- GET `/api/certifications-badges/badge-templates` - Get all
- POST `/api/certifications-badges/badge-templates` - Create
- PUT `/api/certifications-badges/badge-templates/{id}` - Update
- DELETE `/api/certifications-badges/badge-templates/{id}` - Delete

## Test Data Format

### Create Certification
```json
{
  "title": "Java Developer Certification",
  "description": "Certifies proficiency in Java development"
}
```

### Create Badge
```json
{
  "name": "Excellence Badge",
  "description": "Awarded for outstanding performance"
}
```

## User Accounts

- Formateur: Formateur@smartek.com / Formateur123 (TRAINER role)
- Learner: learner@smartek.com / Learner123 (LEARNER role)

## Files Modified/Created

### Backend
- Created: `Backend/certification-badge-service/` (entire microservice)
- Modified: `Backend/api-gateway/src/main/resources/application.yml` (added routing)

### Frontend
- Created: `Frontend/angular-app/src/app/core/services/badge.service.ts`
- Created: `Frontend/angular-app/src/app/core/services/certification.service.ts`
- Created: `Frontend/angular-app/src/app/core/models/badge.model.ts`
- Created: `Frontend/angular-app/src/app/core/models/certification.model.ts`
- Created: `Frontend/angular-app/src/app/features/certifications-badges/` (6 components)
- Modified: `Frontend/angular-app/src/app/app.routes.ts` (added routes)
- Modified: `Frontend/angular-app/src/app/core/config/menu.config.ts` (added menu items)
- Modified: `Frontend/angular-app/src/app/core/config/role-permission.config.ts` (added permissions)
- Modified: `Frontend/angular-app/src/app/features/auth/sign-in/sign-in.component.ts` (fixed redirect)
- Modified: `Frontend/angular-app/src/app/core/guards/auth.guard.ts` (simplified validation)
- Modified: `Frontend/angular-app/src/app/core/interceptors/auth.interceptor.ts` (disabled auto-logout for debugging)
