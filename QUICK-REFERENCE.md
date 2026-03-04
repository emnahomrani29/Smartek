# 🚀 Quick Reference - Advanced Features

## 📦 Installation

```bash
cd Frontend/angular-app
npm install
```

## 🧪 Testing

### Backend Test
```powershell
.\test-features.ps1
```

### Manual API Test
```http
# 1. Login
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "Learner@smartek.com",
  "password": "Learner123"
}

# 2. Test Pagination (use token from step 1)
GET http://localhost:8083/api/certifications-badges/certification-templates/paginated?page=0&size=10
Authorization: Bearer YOUR_TOKEN
```

## 🎨 Frontend Usage

### Certificate Viewer
```typescript
// Navigate to certificate viewer
this.router.navigate(['/certifications-badges/certificate-viewer', certificationId]);
```

### Pagination Component
```html
<app-pagination
  [pageInfo]="pageInfo"
  [pageSizeOptions]="[10, 25, 50]"
  (pageChange)="onPageChange($event)"
  (pageSizeChange)="onPageSizeChange($event)">
</app-pagination>
```

```typescript
pageInfo: PageInfo = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0
};

loadData(): void {
  this.service.getPaginated(this.pageInfo.page, this.pageInfo.size)
    .subscribe(response => {
      this.items = response.content;
      this.pageInfo.totalElements = response.totalElements;
      this.pageInfo.totalPages = response.totalPages;
    });
}
```

## 🔗 API Endpoints

### Pagination Endpoints
```
GET /api/certifications-badges/certification-templates/paginated
GET /api/certifications-badges/badge-templates/paginated
GET /api/certifications-badges/earned-certifications/learner/{id}/paginated
GET /api/certifications-badges/earned-badges/learner/{id}/paginated
```

### Query Parameters
- `page` - Page number (0-indexed)
- `size` - Items per page (default: 10)
- `sortBy` - Field to sort by
- `sortDirection` - ASC or DESC

### Certificate Details
```
GET /api/certifications-badges/earned-certifications/{id}/details
```

## 📄 Response Format

```json
{
  "content": [...],
  "totalElements": 47,
  "totalPages": 5,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false
}
```

## 🎯 Features Checklist

- [x] Certificate viewer with professional design
- [x] PDF download functionality
- [x] Pagination for certification templates
- [x] Pagination for badge templates
- [x] Pagination for earned certifications
- [x] Pagination for earned badges
- [x] Reusable pagination component
- [x] Responsive design
- [x] Loading states
- [x] Error handling

## 📚 Documentation

- `ADVANCED-FEATURES-IMPLEMENTATION.md` - Complete guide
- `IMPLEMENTATION-SUMMARY.md` - Summary
- `test-advanced-features.http` - API tests
- `test-features.ps1` - PowerShell test script

## 🎓 Key Files

### Backend
- Controllers: `*Controller.java` (4 files)
- Services: `*Service.java` (4 files)
- Repositories: `*Repository.java` (2 files)

### Frontend
- Certificate Viewer: `certificate-viewer/` (3 files)
- Pagination: `pagination/` (3 files)
- Services: `certification.service.ts`, `badge.service.ts`

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Start backend
mvn spring-boot:run

# Start frontend
npm start

# Test backend
.\test-features.ps1

# Build for production
npm run build
```

## 🐛 Troubleshooting

**Issue:** PDF not downloading
- Check browser console for errors
- Verify html2canvas and jspdf are installed
- Check certificate element has id="certificate-content"

**Issue:** Pagination not working
- Verify backend endpoints return Page<T>
- Check JWT token is valid
- Verify pageInfo is properly initialized

**Issue:** Certificate viewer blank
- Check route is configured
- Verify certification ID is valid
- Check API endpoint returns data

## 💡 Tips

1. Always test pagination with different page sizes
2. Test PDF generation in multiple browsers
3. Verify responsive design on mobile
4. Check loading states work correctly
5. Test error scenarios (invalid ID, network error)

---

**Need help?** Check the full documentation in `ADVANCED-FEATURES-IMPLEMENTATION.md`
