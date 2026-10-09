export type GameId = 
  | 'memory-match' 
  | 'sequence-memory' 
  | 'different-one' 
  | 'grocery-basket' 
  | 'number-trail' 
  | 'pattern-match' 
  | 'sound-word-match'
  | 'clock-reading'
  | 'rhyme-completion';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type GameLevel = 1 | 2 | 3 | 4 | 5;

export interface GameMetadata {
  id: GameId;
  title: string;
  desc: string;
  tag: string;
  difficulty: string;
  audioInstruction: string;
}

export interface FinishGameStats {
  accuracy: number;
  mistakes: number;
  totalAttempts: number;
}

export interface LevelDescription {
  level: DifficultyLevel;
  label?: string;
  summary: string;
  features: string[];
}

