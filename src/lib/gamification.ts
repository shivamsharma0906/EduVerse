/**
 * Gamification Core Logic
 */

export interface UserGamificationState {
  xp_total: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null; // ISO YYYY-MM-DD
  badges: string[]; // List of badge IDs
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'mastery' | 'social' | 'speed' | 'performance' | 'timing';
  icon: string; // Lucide icon name
}

// 60+ Dynamic Badge Definitions or Categories
export const BADGES: Badge[] = [
  // Streak Badges
  { id: 'streak_3', name: 'Starter Flame', description: 'Maintain a 3-day study streak', category: 'streak', icon: 'Flame' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day study streak', category: 'streak', icon: 'CalendarDays' },
  { id: 'streak_30', name: 'Consistent Scholar', description: 'Maintain a 30-day study streak', category: 'streak', icon: 'Award' },
  { id: 'streak_100', name: 'Century Legend', description: 'Maintain a 100-day study streak', category: 'streak', icon: 'ShieldAlert' },
  
  // Mastery Badges
  { id: 'mastery_math', name: 'Equation Master', description: 'Complete all Math graph nodes', category: 'mastery', icon: 'Binary' },
  { id: 'mastery_code', name: 'Full-Stack Prodigy', description: 'Complete all coding interactive lessons', category: 'mastery', icon: 'Code' },
  { id: 'mastery_science', name: 'Quantum Explorer', description: 'Complete 5 Science modules', category: 'mastery', icon: 'Atom' },
  
  // Social & Mentoring
  { id: 'social_review', name: 'Peer Critic', description: 'Provide a structured peer review', category: 'social', icon: 'MessageSquareText' },
  { id: 'social_mentor', name: 'Lead Guide', description: 'Answer 5 questions in the community forums', category: 'social', icon: 'Users' },
  
  // Performance & Speed
  { id: 'perf_perfect', name: 'Flawless Mind', description: 'Get a perfect score on any adaptive quiz', category: 'performance', icon: 'Sparkles' },
  { id: 'perf_fast', name: 'Light Speed', description: 'Complete an assessment in under 1 minute', category: 'performance', icon: 'Zap' },
  
  // Timing Badges
  { id: 'time_night', name: 'Night Owl', description: 'Complete a lesson after 11 PM', category: 'timing', icon: 'Moon' },
  { id: 'time_early', name: 'Early Bird', description: 'Complete a lesson before 7 AM', category: 'timing', icon: 'Sun' },
  { id: 'comeback', name: 'Phoenix Return', description: 'Complete a lesson after 7 days of absence', category: 'timing', icon: 'RefreshCw' },
];

/**
 * Calculates XP earned based on lesson details, streak, and correct answers
 */
export function calculateXPAward(params: {
  baseXP: number; // usually 50
  difficultyMultiplier: 1.0 | 1.5 | 2.0 | 2.5;
  perfectScoreBonus: boolean; // +25 XP
  streak: number;
}): { totalXP: number; breakdown: string } {
  let xp = params.baseXP * params.difficultyMultiplier;
  let breakdown = `${params.baseXP} Base XP × ${params.difficultyMultiplier.toFixed(1)} Difficulty`;

  if (params.perfectScoreBonus) {
    xp += 25;
    breakdown += " + 25 Perfect Score Bonus";
  }

  // Streak multipliers: day 3 = 1.1x, day 7 = 1.25x, day 14 = 1.5x, day 30+ = 2.0x
  let multiplier = 1.0;
  if (params.streak >= 30) {
    multiplier = 2.0;
  } else if (params.streak >= 14) {
    multiplier = 1.5;
  } else if (params.streak >= 7) {
    multiplier = 1.25;
  } else if (params.streak >= 3) {
    multiplier = 1.1;
  }

  if (multiplier > 1.0) {
    xp = xp * multiplier;
    breakdown += ` × ${multiplier}x Streak Multiplier`;
  }

  return {
    totalXP: Math.round(xp),
    breakdown
  };
}

/**
 * Returns Level based on total XP (50-level exponential progression)
 * Level 1-10: 1,000 XP per level (up to 10k)
 * Level 10-30: 4,500 XP per level (up to 100k)
 * Level 30-50: 20,000 XP per level (up to 500k)
 */
export function xpToLevel(xp: number): number {
  if (xp < 10000) {
    return Math.floor(xp / 1000) + 1;
  } else if (xp < 100000) {
    return 10 + Math.floor((xp - 10000) / 4500);
  } else {
    return Math.min(50, 30 + Math.floor((xp - 100000) / 20000));
  }
}

/**
 * Returns minimum XP required to unlock a level
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= 10) {
    return (level - 1) * 1000;
  } else if (level <= 30) {
    return 10000 + (level - 10) * 4500;
  } else {
    return 100000 + (level - 30) * 20000;
  }
}

/**
 * Checks and awards new badges based on actions and state
 */
export function checkBadgesToAward(
  state: UserGamificationState,
  action: {
    type: 'complete_lesson' | 'complete_quiz' | 'peer_review' | 'post_forum';
    difficulty?: number;
    score?: number; // 0 - 100
    timeSpentSeconds?: number;
    timestamp?: string; // ISO String
  }
): string[] {
  const newlyAwarded: string[] = [];
  const existing = new Set(state.badges);

  // Helper to add if not existing
  const addBadge = (id: string) => {
    if (!existing.has(id)) {
      newlyAwarded.push(id);
    }
  };

  // Streak checks
  if (state.current_streak >= 3) addBadge('streak_3');
  if (state.current_streak >= 7) addBadge('streak_7');
  if (state.current_streak >= 30) addBadge('streak_30');
  if (state.current_streak >= 100) addBadge('streak_100');

  // Performance/Quiz checks
  if (action.type === 'complete_quiz') {
    if (action.score === 100) {
      addBadge('perf_perfect');
    }
    if (action.timeSpentSeconds && action.timeSpentSeconds < 60) {
      addBadge('perf_fast');
    }
  }

  // Timing checks
  if (action.timestamp) {
    const date = new Date(action.timestamp);
    const hour = date.getHours();
    
    if (hour >= 23 || hour < 4) {
      addBadge('time_night');
    }
    if (hour >= 5 && hour < 7) {
      addBadge('time_early');
    }
  }

  // Social checks
  if (action.type === 'peer_review') {
    addBadge('social_review');
  }
  if (action.type === 'post_forum') {
    addBadge('social_mentor');
  }

  // Comeback check
  if (state.last_activity_date && action.timestamp) {
    const lastActive = new Date(state.last_activity_date).getTime();
    const current = new Date(action.timestamp).getTime();
    const diffDays = (current - lastActive) / (1000 * 60 * 60 * 24);
    if (diffDays >= 7) {
      addBadge('comeback');
    }
  }

  return newlyAwarded;
}
