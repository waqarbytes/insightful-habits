import { motion } from 'framer-motion';
import { Target, Flame, TrendingUp, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { useHabits } from '@/context/HabitContext';

export default function Dashboard() {
  const { user, getAllHabitsWithStats, getTotalStreak, getCompletionRate, habits } = useHabits();
  const habitsWithStats = getAllHabitsWithStats();
  const streak = getTotalStreak();
  const completionRate = getCompletionRate();

  const todayCompleted = habitsWithStats.filter(h => h.todayValue >= h.target).length;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Good {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {getMotivationalMessage(todayCompleted, habits.length)}
            </p>
          </div>
          
          <AddHabitDialog />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Today's Progress"
            value={`${todayCompleted}/${habits.length}`}
            subtitle="Habits completed"
            icon={Target}
            color="primary"
            delay={0}
          />
          <StatsCard
            title="Current Streak"
            value={`${streak} days`}
            subtitle={streak >= 7 ? "You're on fire!" : "Keep it up!"}
            icon={Flame}
            color="accent"
            delay={0.1}
          />
          <StatsCard
            title="Completion Rate"
            value={`${Math.round(completionRate)}%`}
            subtitle="Overall average"
            icon={TrendingUp}
            color="success"
            trend={{ value: 5, positive: true }}
            delay={0.2}
          />
          <StatsCard
            title="Total Habits"
            value={habits.length}
            subtitle="Tracking daily"
            icon={Calendar}
            color="warning"
            delay={0.3}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Habits */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Today's Habits</h2>
              <span className="text-sm text-muted-foreground">
                {todayCompleted} of {habits.length} done
              </span>
            </div>
            
            {habitsWithStats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-elevated p-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first habit to start tracking your progress
                </p>
                <AddHabitDialog />
              </motion.div>
            ) : (
              <div className="grid gap-4">
                {habitsWithStats.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            )}
          </div>

          {/* Right column - Widgets */}
          <div className="space-y-6">
            <QuickLogWidget />
            <WeeklyChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getMotivationalMessage(completed: number, total: number): string {
  const ratio = total > 0 ? completed / total : 0;
  if (ratio === 1) return "Perfect day! All habits completed! 🎉";
  if (ratio >= 0.7) return "Great progress! Almost there!";
  if (ratio >= 0.3) return "You're doing well, keep going!";
  if (completed > 0) return "Good start! Let's keep the momentum.";
  return "Let's make today count!";
}
