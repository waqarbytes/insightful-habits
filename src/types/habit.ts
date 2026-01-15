export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'productivity' | 'learning' | 'social';

export type HabitUnit = 'times' | 'minutes' | 'hours' | 'glasses' | 'steps' | 'pages' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  icon: string;
  color: string;
  target: number;
  unit: HabitUnit;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  value: number;
  date: Date;
  note?: string;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  todayValue: number;
  weeklyProgress: number;
  completionRate: number;
}

export interface DailyStats {
  date: Date;
  habitsCompleted: number;
  totalHabits: number;
  completionRate: number;
}

export interface WeeklyTrend {
  day: string;
  completed: number;
  total: number;
  rate: number;
}

export interface CategoryStats {
  category: HabitCategory;
  count: number;
  avgCompletion: number;
}
