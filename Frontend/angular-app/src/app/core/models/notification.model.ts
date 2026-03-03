export interface Notification {
  notificationId: number;
  learnerId: number;
  evidenceId: number;
  message: string;
  type: 'APPROVAL' | 'REJECTION' | 'REVIEW';
  isRead: boolean;
  createdAt: string;
}
