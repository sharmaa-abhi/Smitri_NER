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
