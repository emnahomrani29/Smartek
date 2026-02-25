export interface Event {
  eventId?: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipations: number;
  currentParticipations?: number;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRequest {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipations: number;
}
