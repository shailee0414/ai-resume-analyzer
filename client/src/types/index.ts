export type Theme = 'dark' | 'light' | 'midnight' | 'sepia';

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface ATSCheck {
  label: string;
  pass: boolean;
  note?: string;
}

export interface Suggestion {
  area: string;
  before: string;
  after: string;
  why: string;
}

export interface AnalysisResult {
  id?: string;
  score: number;
  matchSummary: string;
  jobTitle: string;
  strongKeywords: string[];
  missingKeywords: string[];
  atsChecks: ATSCheck[];
  suggestions: Suggestion[];
  createdAt?: string;
}

export interface HistoryItem {
  _id: string;
  jobTitle: string;
  score: number;
  matchSummary: string;
  createdAt: string;
}
