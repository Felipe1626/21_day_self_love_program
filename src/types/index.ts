export interface DayContent {
  title: string;
  content: string;
}

export interface MorningPrompt {
  affirmation: string;
  intentionSuggestion: string;
}

export interface DayProgress {
  morningAffirmation?: string;
  morningIntention?: string;
  nightGratitude?: string;
  dayActivities?: string[];
  lastUpdated?: Date;
}

export interface ProgressData {
  [dayId: string]: DayProgress;
}

export interface UserProfile {
  name: string;
  createdAt: Date;
  lastActive: Date;
}