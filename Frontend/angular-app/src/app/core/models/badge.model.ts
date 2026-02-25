export interface BadgeTemplate {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EarnedBadge {
  id?: number;
  badgeTemplateId: number;
  badgeTemplateName?: string;
  badgeIconUrl?: string;
  learnerId: number;
  learnerName?: string;
  earnedDate: Date;
  awardedBy: number;
  awardedByName?: string;
  createdAt?: Date;
}

export interface AwardBadgeRequest {
  badgeTemplateId: number;
  learnerId: number;
}

export interface BulkAwardBadgeRequest {
  badgeTemplateId: number;
  learnerIds: number[];
}
