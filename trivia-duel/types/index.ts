export interface Team {
  id: string;
  name: string;
  members: string[];
  icon: string;
  score: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: 200 | 400 | 600;
  image?: string;
}

export interface GameState {
  teams: Team[];
  selectedCategories: string[];
  answeredQuestions: string[];
  currentQuestion: Question | null;
  wagerAvailable: {
    team1: boolean;
    team2: boolean;
  };
  wagerActive: boolean;
  wagerTeam: string | null;
  wagerTargetTeam: string | null;
  wagerMultiplier: 0.5 | 1.5 | 2 | null;
  gameCompleted: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  tokens: number;
}