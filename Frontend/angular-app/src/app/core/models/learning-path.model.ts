export enum LearningPathStatus {
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ABANDONNE = 'ABANDONNE'
}

export interface LearningPathRequest {
  title: string;
  description?: string;
  learnerId: number;
  learnerName: string;
  status: LearningPathStatus;
  startDate: string;
  endDate?: string;
  progress: number;
}

export interface LearningPathResponse {
  pathId: number;
  title: string;
  description: string;
  learnerId: number;
  learnerName: string;
  status: LearningPathStatus;
  startDate: string;
  endDate: string;
  progress: number;
}
