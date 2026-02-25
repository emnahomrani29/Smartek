export interface Planning {
  planningId: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  eventType: string;
  location?: string;
  color: string;
}

export interface PlanningRequest {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  eventType: string;
  location?: string;
  color: string;
}

export interface EventType {
  value: string;
  label: string;
  color: string;
  icon: string;
}
