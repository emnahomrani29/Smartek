export interface SkillEvidenceRequest {
  title: string;
  fileUrl?: string;
  description?: string;
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  category?: 'PROGRAMMING' | 'DESIGN' | 'MANAGEMENT' | 'COMMUNICATION' | 'OTHER';
}

export interface SkillEvidenceResponse {
  evidenceId: number;
  title: string;
  fileUrl?: string;
  description?: string;
  uploadDate: string;
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  
  // Validation fields
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  score?: number; // 0-100, present if approved
  adminComment?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  category: 'PROGRAMMING' | 'DESIGN' | 'MANAGEMENT' | 'COMMUNICATION' | 'OTHER';
}

// Analytics DTOs
export interface LearnerAnalytics {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  averageScore: number | null;
  
  categoryDistribution: { [key: string]: number };
  scoreTrend: ScoreTrendPoint[];
}

export interface ScoreTrendPoint {
  date: string;
  score: number;
  title: string;
}

export interface GlobalAnalytics {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  approvalRate: number;
  averageScore: number | null;
  
  categoryDistribution: { [key: string]: number };
  submissionTrend: { [date: string]: number };
  statusDistribution: { [status: string]: number };
}
