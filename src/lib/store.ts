// Global State Manager (client-side mock database with localStorage persistence)
import { MOCK_USERS, MOCK_SUBJECTS, MOCK_COURSES, MOCK_LEADERBOARD, Course, Subject, JobListing, MOCK_JOBS } from './mockData';
import { IRTQuestion, thetaToScore } from './irt';
import { UserGamificationState, checkBadgesToAward, calculateXPAward } from './gamification';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: 'student' | 'teacher' | 'admin' | 'recruiter';
  plan: 'free' | 'premium' | 'pro' | 'enterprise';
  onboarding_completed: boolean;
}

export interface UserSettings {
  dyslexiaFont: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  learningPace: 'relaxed' | 'balanced' | 'intensive';
  ttsLanguage: string;
  lowBandwidth: boolean;
  offlineMode: boolean;
}

export interface TutorSessionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  toolCall?: any;
}

export interface TutorSession {
  id: string;
  subjectId: string;
  startedAt: string;
  endedAt?: string;
  messages: TutorSessionMessage[];
  summary?: string;
}

export interface EduVerseStore {
  user: UserProfile;
  settings: UserSettings;
  gamification: UserGamificationState;
  skills: Record<string, { score: number; confidence: number }>; // skill_slug -> score/confidence
  attemptedLessons: string[]; // lessonIds
  attemptedQuestions: string[]; // questionIds
  tutorSessions: TutorSession[];
  activeSessionId: string | null;
  courses: Course[];
  subjects: Subject[];
  jobs: JobListing[];
  targetRoles: string[];
  resumeData: {
    fullName: string;
    email: string;
    skills: string[];
    experience: string;
    education: string;
  };
  socraticMode: boolean;
}

const DEFAULT_STORE: EduVerseStore = {
  user: MOCK_USERS.student as UserProfile,
  settings: {
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false,
    learningPace: 'balanced',
    ttsLanguage: 'en-US',
    lowBandwidth: false,
    offlineMode: false,
  },
  gamification: {
    xp_total: 1250,
    coins: 150,
    current_streak: 3,
    longest_streak: 5,
    last_activity_date: new Date().toISOString().split('T')[0],
    badges: ['streak_3'],
  },
  skills: {
    'computer-science': { score: 450, confidence: 0.35 },
    'mathematics': { score: 320, confidence: 0.20 },
    'quantum-physics': { score: 150, confidence: 0.10 },
    'molecular-biology': { score: 100, confidence: 0.05 },
  },
  attemptedLessons: [],
  attemptedQuestions: [],
  tutorSessions: [
    {
      id: 'sess-1',
      subjectId: 'sub-cs',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        { id: 'm-1', role: 'user', content: 'What is QuickSort time complexity?', timestamp: new Date(Date.now() - 3500000).toISOString() },
        { id: 'm-2', role: 'assistant', content: 'QuickSort is O(n log n) on average but O(n^2) in the worst case when the pivot is poorly chosen.', timestamp: new Date(Date.now() - 3400000).toISOString(), modelUsed: 'Claude 3.5 Sonnet' }
      ],
      summary: 'Reviewed worst-case performance of QuickSort and correct pivot choice algorithms.'
    }
  ],
  activeSessionId: null,
  courses: MOCK_COURSES,
  subjects: MOCK_SUBJECTS,
  jobs: MOCK_JOBS,
  targetRoles: ['Senior AI Engineer', 'Full-Stack Developer (L4)'],
  resumeData: {
    fullName: 'Shivam Kumar',
    email: 'shivam@eduverse.ai',
    skills: ['React', 'TypeScript', 'Next.js', 'PostgreSQL', 'Python'],
    experience: 'Software Engineering Intern at CodeLabs (6 months). Built interactive dashboards and optimized SQL query pipelines.',
    education: 'B.S. in Computer Science, State University (Junior Year).'
  },
  socraticMode: false
};

const STORAGE_KEY = 'eduverse_store';

export function getStore(): EduVerseStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STORE));
    return DEFAULT_STORE;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: EduVerseStore) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export function updateStore(updater: (store: EduVerseStore) => void): EduVerseStore {
  const store = getStore();
  updater(store);
  saveStore(store);
  return store;
}

/**
 * Helper: Award XP and check badges
 */
export function awardXpToUser(
  baseXP: number,
  difficultyMultiplier: 1.0 | 1.5 | 2.0 | 2.5,
  isPerfect: boolean,
  actionType: 'complete_lesson' | 'complete_quiz' | 'peer_review' | 'post_forum'
): { xpEarned: number; newLevelReached: boolean; badgesEarned: string[] } {
  let newLevelReached = false;
  let badgesEarned: string[] = [];
  let xpEarned = 0;

  updateStore((store) => {
    const { totalXP, breakdown } = calculateXPAward({
      baseXP,
      difficultyMultiplier,
      perfectScoreBonus: isPerfect,
      streak: store.gamification.current_streak
    });

    xpEarned = totalXP;
    const oldLevel = Math.floor(store.gamification.xp_total / 1000) + 1; // Simplified visual level trigger
    
    // Add XP
    store.gamification.xp_total += totalXP;
    store.gamification.coins += Math.round(totalXP * 0.1); // 10% coins conversion
    
    const newLevel = Math.floor(store.gamification.xp_total / 1000) + 1;
    if (newLevel > oldLevel) {
      newLevelReached = true;
    }

    // Check Badges
    const newlyAwarded = checkBadgesToAward(store.gamification, {
      type: actionType,
      score: isPerfect ? 100 : 80,
      timestamp: new Date().toISOString()
    });

    if (newlyAwarded.length > 0) {
      store.gamification.badges.push(...newlyAwarded);
      badgesEarned = newlyAwarded;
    }

    // Update Activity Date
    store.gamification.last_activity_date = new Date().toISOString().split('T')[0];
  });

  return { xpEarned, newLevelReached, badgesEarned };
}
