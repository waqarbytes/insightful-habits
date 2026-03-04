import { motion } from 'framer-motion';
import { Target, Flame, TrendingUp, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { useHabits } from '@/context/HabitContext';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user, profile, getAllHabitsWithStats, getTotalStreak, getCompletionRate, getCompletionRateTrend, habits } = useHabits();
  const habitsWithStats = getAllHabitsWithStats();
  const streak = getTotalStreak();
  const completionRate = getCompletionRate();
  const completionRateTrend = getCompletionRateTrend();
  const { t } = useTranslation();

  const todayCompleted = habitsWithStats.filter(h => h.todayValue >= h.target).length;
  const greetingKey = getGreetingKey();

  return (
    <AppLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t(greetingKey)}, {profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {getStatusMessage(todayCompleted, habits.length, t)}
            </p>
          </div>

          <AddHabitDialog />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('dashboard.todays_progress')}
            value={`${todayCompleted}/${habits.length}`}
            subtitle={t('dashboard.habits_completed')}
            icon={Target}
            color="primary"
            delay={0}
          />
          <StatsCard
            title={t('dashboard.current_streak')}
            value={`${streak} days`}
            subtitle={streak >= 7 ? t('dashboard.consistent_streak') : t('dashboard.current_sequence')}
            icon={Flame}
            color="accent"
            delay={0.1}
          />
          <StatsCard
            title={t('dashboard.completion_rate')}
            value={`${Math.round(completionRate)}%`}
            subtitle={t('dashboard.overall_average')}
            icon={TrendingUp}
            color="success"
            trend={completionRateTrend}
            delay={0.2}
          />
          <StatsCard
            title={t('dashboard.total_habits')}
            value={habits.length}
            subtitle={t('dashboard.tracking_daily')}
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
              <h2 className="text-lg font-semibold text-foreground">{t('dashboard.todays_habits')}</h2>
              <span className="text-sm text-muted-foreground">
                {todayCompleted} of {habits.length} {t('dashboard.done')}
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
                <h3 className="font-semibold text-foreground mb-2">{t('dashboard.no_habits_yet')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('dashboard.create_first_habit')}
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

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'dashboard.good_morning';
  if (hour < 17) return 'dashboard.good_afternoon';
  return 'dashboard.good_evening';
}

function getStatusMessage(completed: number, total: number, t: (key: string) => string): string {
  if (total === 0) return t('dashboard.no_habits_tracked');
  const ratio = completed / total;
  if (ratio === 1) return t('dashboard.all_targets_met');
  if (ratio >= 0.7) return `${Math.round(ratio * 100)}% ${t('dashboard.targets_met_percent')}`;
  if (ratio >= 0.3) return t('dashboard.progress_recorded');
  if (completed > 0) return t('dashboard.activity_started');
  return t('dashboard.no_activity');
}
