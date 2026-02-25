# Certification and Badge Management - Frontend Setup Guide

## What Was Created

### Services
- `badge.service.ts` - Service for badge template and earned badge operations
- `certification.service.ts` - Service for certification template and earned certification operations

### Models
- `badge.model.ts` - TypeScript interfaces for badges
- `certification.model.ts` - TypeScript interfaces for certifications

### Components
1. **Badge Template List** - View all badge templates
2. **Badge Template Form** - Create/Edit badge templates
3. **Award Badge** - Award badges to learners
4. **Certification Template List** - View all certification templates
5. **Certification Template Form** - Create/Edit certification templates
6. **Award Certification** - Award certifications to learners

### Routes
- `/dashboard/badges` - Badge template list
- `/dashboard/badges/new` - Create new badge template
- `/dashboard/badges/edit/:id` - Edit badge template
- `/dashboard/badges/award` - Award badge to learner
- `/dashboard/certifications` - Certification template list
- `/dashboard/certifications/new` - Create new certification template
- `/dashboard/certifications/edit/:id` - Edit certification template
- `/dashboard/certifications/award` - Award certification to learner

## How to Start the Frontend

### 1. Navigate to the Angular app directory
```bash
cd Frontend\angular-app
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Start the development server
```bash
npm start
```
or
```bash
ng serve
```

The app will run on: http://localhost:4200

## Testing the Features

### Prerequisites
1. Make sure all backend services are running:
   - Eureka Server (port 8761)
   - Auth Service (port 8081)
   - Certification-Badge Service (port 8082)
   - API Gateway (port 8080)

2. Login to the application with a user that has the appropriate permissions:
   - CERTIFICATIONS_VIEW permission for certifications
   - BADGES_VIEW permission for badges

### Test Flow

1. **Login** at http://localhost:4200/auth/sign-in

2. **Navigate to Badges**:
   - Click "Badges" in the sidebar menu
   - You should see the badge template list (empty initially)

3. **Create a Badge Template**:
   - Click "Create New Badge"
   - Fill in the form:
     - Name: "Excellence Badge"
     - Description: "Awarded for outstanding performance"
     - Criteria: "Complete all courses with 90%+ score"
     - Icon URL: (optional)
     - Active: checked
   - Click "Create Badge"

4. **Award a Badge**:
   - Click "Award Badge"
   - Select the badge template
   - Enter a learner ID
   - Click "Award Badge"

5. **Navigate to Certifications**:
   - Click "Certifications" in the sidebar menu
   - You should see the certification template list (empty initially)

6. **Create a Certification Template**:
   - Click "Create New Certification"
   - Fill in the form:
     - Name: "Java Developer Certification"
     - Description: "Certifies proficiency in Java development"
     - Criteria: "Pass Java exam with 80%+ score"
     - Validity Period: 12 months
     - Active: checked
   - Click "Create Certification"

7. **Award a Certification**:
   - Click "Award Certification"
   - Select the certification template
   - Enter a learner ID
   - Click "Award Certification"

## API Endpoints Used

All requests go through the API Gateway at http://localhost:8080

### Badge Templates
- GET `/api/badge-templates` - Get all templates
- GET `/api/badge-templates/active` - Get active templates
- GET `/api/badge-templates/{id}` - Get template by ID
- POST `/api/badge-templates` - Create template
- PUT `/api/badge-templates/{id}` - Update template
- DELETE `/api/badge-templates/{id}` - Delete template

### Earned Badges
- GET `/api/earned-badges` - Get all earned badges
- GET `/api/earned-badges/learner/{learnerId}` - Get badges by learner
- POST `/api/earned-badges/award` - Award badge
- DELETE `/api/earned-badges/{id}` - Revoke badge

### Certification Templates
- GET `/api/certification-templates` - Get all templates
- GET `/api/certification-templates/active` - Get active templates
- GET `/api/certification-templates/{id}` - Get template by ID
- POST `/api/certification-templates` - Create template
- PUT `/api/certification-templates/{id}` - Update template
- DELETE `/api/certification-templates/{id}` - Delete template

### Earned Certifications
- GET `/api/earned-certifications` - Get all earned certifications
- GET `/api/earned-certifications/learner/{learnerId}` - Get certifications by learner
- POST `/api/earned-certifications/award` - Award certification
- DELETE `/api/earned-certifications/{id}` - Revoke certification

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure the API Gateway has CORS configured properly.

### Authentication Issues
Make sure you have a valid JWT token. The auth interceptor automatically adds the token to requests.

### 404 Errors
Make sure the certification-badge-service is registered with Eureka and the API Gateway can route to it.

### Module Not Found
If you get module errors, run `npm install` again.

## Next Steps

You can enhance the UI by:
1. Adding pagination to the lists
2. Adding search and filter functionality
3. Adding image upload for badge icons
4. Creating a learner view to see their earned badges and certifications
5. Adding statistics and charts
6. Adding bulk award functionality with file upload
