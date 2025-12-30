import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Habit, HabitLog, HabitWithStats, WeeklyTrend, CategoryStats, HabitCategory } from '@/types/habit';

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface HabitContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  habits: Habit[];
  logs: HabitLog[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  logHabit: (habitId: string, value: number, note?: string) => Promise<void>;
  getHabitWithStats: (habitId: string) => HabitWithStats | null;
  getAllHabitsWithStats: () => HabitWithStats[];
  getWeeklyTrends: () => WeeklyTrend[];
  getCategoryStats: () => CategoryStats[];
  getTotalStreak: () => number;
  getCompletionRate: () => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  }, []);

  // Fetch habits data
  const fetchHabits = useCallback(async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setHabits(data.map((h: any) => ({
        id: h.id,
        name: h.name,
        description: h.description,
        category: h.category as HabitCategory,
        icon: h.icon,
        color: h.color,
        target: h.target,
        unit: h.unit,
        frequency: h.frequency,
        createdAt: new Date(h.created_at),
      })));
    }
  }, []);

  // Fetch logs data
  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setLogs(data.map((l: any) => ({
        id: l.id,
        habitId: l.habit_id,
        value: l.value,
        date: new Date(l.date),
        note: l.note,
      })));
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer data fetching with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchHabits();
            fetchLogs();
          }, 0);
        } else {
          setProfile(null);
          setHabits([]);
          setLogs([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchHabits();
        fetchLogs();
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchHabits, fetchLogs]);

  const login = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setHabits([]);
    setLogs([]);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ error: string | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });
    
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        icon: habit.icon,
        color: habit.color,
        target: habit.target,
        unit: habit.unit,
        frequency: habit.frequency,
      })
      .select()
      .single();
    
    if (!error && data) {
      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category as HabitCategory,
        icon: data.icon,
        color: data.color,
        target: data.target,
        unit: data.unit,
        frequency: data.frequency as 'daily' | 'weekly',
        createdAt: new Date(data.created_at),
      };
      setHabits(prev => [newHabit, ...prev]);
    }
  }, [user]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.target !== undefined) dbUpdates.target = updates.target;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;

    const { error } = await supabase
      .from('habits')
      .update(dbUpdates)
      .eq('id', id);
    
    if (!error) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setHabits(prev => prev.filter(h => h.id !== id));
      setLogs(prev => prev.filter(l => l.habitId !== id));
    }
  }, []);

  const logHabit = useCallback(async (habitId: string, value: number, note?: string) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if log exists for today
    const existingLog = logs.find(
      l => l.habitId === habitId && l.date.toISOString().split('T')[0] === today
    );
    
    if (existingLog) {
      // Update existing log
      const { error } = await supabase
        .from('habit_logs')
        .update({ value, note })
        .eq('id', existingLog.id);
      
      if (!error) {
        setLogs(prev => prev.map(l => 
          l.id === existingLog.id ? { ...l, value, note } : l
        ));
      }
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          value,
          date: today,
          note,
        })
        .select()
        .single();
      
      if (!error && data) {
        setLogs(prev => [...prev, {
          id: data.id,
          habitId: data.habit_id,
          value: data.value,
          date: new Date(data.date),
          note: data.note,
        }]);
      }
    }
  }, [user, logs]);

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
      profile,
      session,
      habits,
      logs,
      isAuthenticated: !!session,
      isLoading,
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
