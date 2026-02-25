export interface CertificationTemplate {
  id?: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EarnedCertification {
  id?: number;
  certificationTemplateId: number;
  certificationTemplateName?: string;
  learnerId: number;
  learnerName?: string;
  issuedDate: Date;
  expiryDate?: Date;
  issuedBy: number;
  issuedByName?: string;
  createdAt?: Date;
}

export interface AwardCertificationRequest {
  certificationTemplateId: number;
  learnerId: number;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface BulkAwardCertificationRequest {
  certificationTemplateId: number;
  learnerIds: number[];
}
