# Fonctionnalité de Gestion des Chapitres

## Vue d'ensemble
Cette fonctionnalité permet d'ajouter des chapitres à chaque cours avec la possibilité d'uploader des fichiers PDF pour chaque chapitre.

## Structure de la Base de Données

### Table `chapters`
- `chapter_id` (BIGINT, PK, AUTO_INCREMENT)
- `title` (VARCHAR, NOT NULL) - Titre du chapitre
- `description` (TEXT) - Description du chapitre
- `order_index` (INT, NOT NULL) - Ordre d'affichage du chapitre
- `pdf_file_name` (VARCHAR) - Nom original du fichier PDF
- `pdf_file_path` (VARCHAR) - Chemin du fichier PDF sur le serveur
- `course_id` (BIGINT, FK, NOT NULL) - Référence au cours
- `created_at` (TIMESTAMP, NOT NULL)
- `updated_at` (TIMESTAMP)

### Relation
- Un cours peut avoir plusieurs chapitres (OneToMany)
- Un chapitre appartient à un seul cours (ManyToOne)
- Suppression en cascade : si un cours est supprimé, tous ses chapitres sont supprimés

## API Endpoints

### 1. Créer un chapitre
```
POST /courses/{courseId}/chapters
Content-Type: application/json

Body:
{
  "title": "Introduction",
  "description": "Chapitre d'introduction au cours",
  "orderIndex": 1
}

Response: 201 Created
{
  "chapterId": 1,
  "title": "Introduction",
  "description": "Chapitre d'introduction au cours",
  "orderIndex": 1,
  "courseId": 1,
  "createdAt": "2026-02-22T21:00:00",
  "updatedAt": "2026-02-22T21:00:00"
}
```

### 2. Lister les chapitres d'un cours
```
GET /courses/{courseId}/chapters

Response: 200 OK
[
  {
    "chapterId": 1,
    "title": "Introduction",
    "description": "Chapitre d'introduction",
    "orderIndex": 1,
    "pdfFileName": "intro.pdf",
    "pdfFilePath": "uploads/pdfs/uuid.pdf",
    "courseId": 1
  }
]
```

### 3. Obtenir un chapitre
```
GET /courses/{courseId}/chapters/{chapterId}

Response: 200 OK
{
  "chapterId": 1,
  "title": "Introduction",
  "description": "Chapitre d'introduction",
  "orderIndex": 1,
  "courseId": 1
}
```

### 4. Mettre à jour un chapitre
```
PUT /courses/{courseId}/chapters/{chapterId}
Content-Type: application/json

Body:
{
  "title": "Introduction Modifiée",
  "description": "Nouvelle description",
  "orderIndex": 1
}

Response: 200 OK
```

### 5. Upload d'un PDF
```
POST /courses/{courseId}/chapters/{chapterId}/upload-pdf
Content-Type: multipart/form-data

Form Data:
- file: [fichier PDF]

Response: 200 OK
{
  "chapterId": 1,
  "title": "Introduction",
  "pdfFileName": "intro.pdf",
  "pdfFilePath": "uploads/pdfs/uuid.pdf"
}
```

### 6. Supprimer un chapitre
```
DELETE /courses/{courseId}/chapters/{chapterId}

Response: 204 No Content
```

## Validation

### Création/Mise à jour de chapitre
- `title` : Obligatoire, non vide
- `orderIndex` : Obligatoire, doit être > 0

### Upload de PDF
- Type de fichier : Uniquement PDF (application/pdf)
- Taille maximale : 10 MB (configurable dans le frontend)

## Stockage des Fichiers

Les fichiers PDF sont stockés dans le répertoire `uploads/pdfs/` avec un nom unique généré (UUID).

Structure:
```
uploads/
  └── pdfs/
      ├── uuid1.pdf
      ├── uuid2.pdf
      └── ...
```

## Frontend

### Routes
- `/dashboard/courses` - Liste des cours
- `/dashboard/courses/:courseId/chapters` - Gestion des chapitres d'un cours

### Composants
- `CourseManagementComponent` - Gestion des cours avec bouton "Gérer les chapitres"
- `ChapterManagementComponent` - Gestion des chapitres avec upload de PDF

### Services
- `ChapterService` - Service Angular pour les appels API des chapitres

## Sécurité

- Tous les endpoints nécessitent une authentification
- Seuls les utilisateurs avec les rôles `RH_SMARTEK` ou `TRAINER` peuvent gérer les chapitres
- Validation du type de fichier côté serveur pour éviter l'upload de fichiers malveillants

## Améliorations Futures

1. Téléchargement des PDFs pour les étudiants
2. Prévisualisation des PDFs dans le navigateur
3. Support d'autres types de fichiers (vidéos, images)
4. Réorganisation des chapitres par drag & drop
5. Statistiques de consultation des chapitres
6. Versioning des PDFs
