export interface Notification {
  id: number;
  userId: number;
  userRole: string;
  type: string;
  title: string;
  message: string;
  relatedOfferId?: number;
  isRead: boolean;
  createdAt: string;
}
