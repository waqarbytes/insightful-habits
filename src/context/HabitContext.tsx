import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Habit, HabitLog, HabitWithStats, WeeklyTrend, CategoryStats, HabitCategory } from '@/types/habit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
}

interface HabitContextType {
  user: User | null;
  habits: Habit[];
  logs: HabitLog[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (habitId: string, value: number, note?: string) => void;
  getHabitWithStats: (habitId: string) => HabitWithStats | null;
  getAllHabitsWithStats: () => HabitWithStats[];
  getWeeklyTrends: () => WeeklyTrend[];
  getCategoryStats: () => CategoryStats[];
  getTotalStreak: () => number;
  getCompletionRate: () => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    icon: 'Droplets',
    color: '#0EA5E9',
    target: 8,
    unit: 'glasses',
    frequency: 'daily',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Morning Exercise',
    description: '30 minutes of physical activity',
    category: 'fitness',
    icon: 'Dumbbell',
    color: '#10B981',
    target: 30,
    unit: 'minutes',
    frequency: 'daily',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Meditation',
    description: 'Mindfulness and calm',
    category: 'mindfulness',
    icon: 'Brain',
    color: '#8B5CF6',
    target: 15,
    unit: 'minutes',
    frequency: 'daily',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Read',
    description: 'Read books or articles',
    category: 'learning',
    icon: 'BookOpen',
    color: '#F59E0B',
    target: 20,
    unit: 'pages',
    frequency: 'daily',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Sleep 8 Hours',
    description: 'Get quality rest',
    category: 'health',
    icon: 'Moon',
    color: '#6366F1',
    target: 8,
    unit: 'hours',
    frequency: 'daily',
    createdAt: new Date('2024-01-01'),
  },
];

const generateMockLogs = (habits: Habit[]): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = new Date();
  
  habits.forEach(habit => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const shouldComplete = Math.random() > 0.2;
      if (shouldComplete) {
        const completionRate = 0.6 + Math.random() * 0.5;
        logs.push({
          id: `${habit.id}-${i}`,
          habitId: habit.id,
          value: Math.floor(habit.target * completionRate),
          date,
        });
      }
    }
  });
  
  return logs;
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('habitUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });
  
  const [logs, setLogs] = useState<HabitLog[]>(() => {
    const saved = localStorage.getItem('habitLogs');
    if (saved) return JSON.parse(saved);
    return generateMockLogs(defaultHabits);
  });

  useEffect(() => {
    if (user) localStorage.setItem('habitUser', JSON.stringify(user));
    else localStorage.removeItem('habitUser');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitLogs', JSON.stringify(logs));
  }, [logs]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (email && password.length >= 6) {
      setUser({
        id: '1',
        name: email.split('@')[0],
        email,
        joinedAt: new Date(),
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    if (name && email && password.length >= 6) {
      setUser({
        id: '1',
        name,
        email,
        joinedAt: new Date(),
      });
      return true;
    }
    return false;
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  }, []);

  const logHabit = useCallback((habitId: string, value: number, note?: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingLog = logs.find(
      l => l.habitId === habitId && new Date(l.date).toDateString() === today.toDateString()
    );
    
    if (existingLog) {
      setLogs(prev => prev.map(l => 
        l.id === existingLog.id ? { ...l, value, note } : l
      ));
    } else {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        habitId,
        value,
        date: today,
        note,
      }]);
    }
  }, [logs]);

  const getHabitWithStats = useCallback((habitId: string): HabitWithStats | null => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return null;

    const habitLogs = logs.filter(l => l.habitId === habitId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLog = habitLogs.find(l => 
      new Date(l.date).toDateString() === today.toDateString()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const log = habitLogs.find(l => 
        new Date(l.date).toDateString() === date.toDateString() && l.value >= habit.target
      );
      
      if (log) {
        tempStreak++;
        if (i === 0 || currentStreak > 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
        if (i === 0) currentStreak = 0;
      }
    }

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const weekLogs = habitLogs.filter(l => new Date(l.date) >= weekStart);
    const weeklyProgress = weekLogs.reduce((sum, l) => sum + l.value, 0) / (habit.target * 7) * 100;

    const completedDays = habitLogs.filter(l => l.value >= habit.target).length;
    const totalDays = Math.ceil((today.getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const completionRate = (completedDays / Math.max(totalDays, 1)) * 100;

    return {
      ...habit,
      currentStreak,
      longestStreak,
      todayValue: todayLog?.value || 0,
      weeklyProgress: Math.min(weeklyProgress, 100),
      completionRate,
    };
  }, [habits, logs]);

  const getAllHabitsWithStats = useCallback((): HabitWithStats[] => {
    return habits.map(h => getHabitWithStats(h.id)).filter(Boolean) as HabitWithStats[];
  }, [habits, getHabitWithStats]);

  const getWeeklyTrends = useCallback((): WeeklyTrend[] => {
    const trends: WeeklyTrend[] = [];
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayLogs = logs.filter(l => 
        new Date(l.date).toDateString() === date.toDateString()
      );
      
      const completed = dayLogs.filter(l => {
        const habit = habits.find(h => h.id === l.habitId);
        return habit && l.value >= habit.target;
      }).length;
      
      trends.push({
        day: days[date.getDay()],
        completed,
        total: habits.length,
        rate: habits.length > 0 ? (completed / habits.length) * 100 : 0,
      });
    }
    
    return trends;
  }, [logs, habits]);

  const getCategoryStats = useCallback((): CategoryStats[] => {
    const categories: HabitCategory[] = ['health', 'fitness', 'mindfulness', 'productivity', 'learning', 'social'];
    
    return categories.map(category => {
      const categoryHabits = habits.filter(h => h.category === category);
      const avgCompletion = categoryHabits.length > 0
        ? categoryHabits.reduce((sum, h) => {
            const stats = getHabitWithStats(h.id);
            return sum + (stats?.completionRate || 0);
          }, 0) / categoryHabits.length
        : 0;
      
      return { category, count: categoryHabits.length, avgCompletion };
    }).filter(c => c.count > 0);
  }, [habits, getHabitWithStats]);

  const getTotalStreak = useCallback((): number => {
    const allStats = getAllHabitsWithStats();
    return Math.max(...allStats.map(h => h.currentStreak), 0);
  }, [getAllHabitsWithStats]);

  const getCompletionRate = useCallback((): number => {
    const allStats = getAllHabitsWithStats();
    if (allStats.length === 0) return 0;
    return allStats.reduce((sum, h) => sum + h.completionRate, 0) / allStats.length;
  }, [getAllHabitsWithStats]);

  return (
    <HabitContext.Provider value={{
      user,
      habits,
      logs,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      addHabit,
      updateHabit,
      deleteHabit,
      logHabit,
      getHabitWithStats,
      getAllHabitsWithStats,
      getWeeklyTrends,
      getCategoryStats,
      getTotalStreak,
      getCompletionRate,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
