// core/models/learning-style.model.ts

export enum LearningStyleType {
    VISUAL = 'VISUAL',
    AUDITORY = 'AUDITORY',
    READING = 'READING',
    KINESTHETIC = 'KINESTHETIC'
}

export interface LearningStylePreference {
    preferredStyle: LearningStyleType;
    videoPreferred: boolean;
    textPreferred: boolean;
    practicalWorkPreferred: boolean;
}

// Pour l'affichage
export const LearningStyleLabels: Record<LearningStyleType, string> = {
    [LearningStyleType.VISUAL]: 'Visuel',
    [LearningStyleType.AUDITORY]: 'Auditif',
    [LearningStyleType.READING]: 'Lecture',
    [LearningStyleType.KINESTHETIC]: 'Pratique'
};

// Descriptions détaillées
export const LearningStyleDescriptions: Record<LearningStyleType, string> = {
    [LearningStyleType.VISUAL]: 'J\'apprends mieux avec des vidéos, des images et des diagrammes',
    [LearningStyleType.AUDITORY]: 'Je préfère les podcasts, les discussions et les explications orales',
    [LearningStyleType.READING]: 'Je retiens mieux en lisant des textes et de la documentation',
    [LearningStyleType.KINESTHETIC]: 'J\'apprends en faisant des exercices pratiques et des TP'
};

// Icônes pour chaque style
export const LearningStyleIcons: Record<LearningStyleType, string> = {
    [LearningStyleType.VISUAL]: 'fas fa-eye',
    [LearningStyleType.AUDITORY]: 'fas fa-headphones',
    [LearningStyleType.READING]: 'fas fa-book',
    [LearningStyleType.KINESTHETIC]: 'fas fa-laptop-code'
};

// Couleurs pour chaque style
export const LearningStyleColors: Record<LearningStyleType, string> = {
    [LearningStyleType.VISUAL]: '#9C27B0',
    [LearningStyleType.AUDITORY]: '#2196F3',
    [LearningStyleType.READING]: '#4CAF50',
    [LearningStyleType.KINESTHETIC]: '#FF9800'
};