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
}

export interface ProgressData {
  [dayId: string]: DayProgress;
}