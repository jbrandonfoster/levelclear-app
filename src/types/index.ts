export interface DayContent {
  dayNumber: number;
  title: string;
  truth: string;
  question: string;
  move: string;
  phase: 'THE DECISION' | 'THE VALLEY' | 'THE SHIFT' | 'THE FOUNDATION' | 'PLUS ONE';
}

export interface LevelContent {
  levelNumber: number;
  title: string;
  subtitle: string;
  sections: LevelSection[];
}

export interface LevelSection {
  title: string;
  content: string;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  image?: string;
  currentDay: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
}

export interface DayCompletionData {
  dayNumber: number;
  completed: boolean;
  completedAt?: string;
}

export interface CommunityPostData {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  userDay: number;
  isCreator: boolean;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  image?: string;
  points: number;
  streak: number;
  currentDay: number;
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  unlockedAt?: string;
}
