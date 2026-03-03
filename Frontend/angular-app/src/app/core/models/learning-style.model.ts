export enum LearningStyleType {
  VISUAL = 'VISUAL',
  AUDITORY = 'AUDITORY',
  READ_WRITE = 'READ_WRITE',
  KINESTHETIC = 'KINESTHETIC',
  MULTIMODAL = 'MULTIMODAL'
}

export interface LearningStylePreferenceRequest {
  preferredStyle: LearningStyleType;
  videoPreferred?: boolean;
  textPreferred?: boolean;
  practicalWorkPreferred?: boolean;
  learnerId: number;
  learnerName: string;
}

export interface LearningStylePreferenceResponse {
  id: number;
  preferredStyle: LearningStyleType;
  videoPreferred: boolean;
  textPreferred: boolean;
  practicalWorkPreferred: boolean;
  lastUpdated: string;
  learnerId: number;
  learnerName: string;
}

// Alias for convenience - LearningStylePreference is the same as the response
export type LearningStylePreference = LearningStylePreferenceResponse;
