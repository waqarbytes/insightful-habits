import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { CompletionRing } from '@/components/analytics/CompletionRing';
import { StreakIndicator } from '@/components/habits/StreakIndicator';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useHabits } from '@/context/HabitContext';
import { useTranslation } from 'react-i18next';

export default function Analytics() {
  const { getAllHabitsWithStats, getCompletionRate, getTotalStreak, habits } = useHabits();
  const habitsWithStats = getAllHabitsWithStats();
  const completionRate = getCompletionRate();
  const streak = getTotalStreak();
  const { t } = useTranslation();

  const longestStreak = Math.max(...habitsWithStats.map(h => h.longestStreak), 0);
  const averageWeeklyProgress = habitsWithStats.length > 0
    ? habitsWithStats.reduce((sum, h) => sum + h.weeklyProgress, 0) / habitsWithStats.length
    : 0;

  const topHabits = [...habitsWithStats]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('analytics.subtitle')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('analytics.completion')}
            value={`${Math.round(completionRate)}%`}
            subtitle={t('dashboard.overall_average')}
            icon={TrendingUp}
            color="primary"
            delay={0}
          />
          <StatsCard
            title={t('dashboard.current_streak')}
            value={`${streak} days`}
            subtitle="Keep it up!"
            icon={Flame}
            color="accent"
            delay={0.1}
          />
          <StatsCard
            title={t('analytics.longest_streak')}
            value={`${longestStreak} days`}
            subtitle={t('analytics.personal_best')}
            icon={Award}
            color="warning"
            delay={0.2}
          />
          <StatsCard
            title={t('analytics.active_habits')}
            value={habits.length}
            subtitle={t('analytics.being_tracked')}
            icon={Target}
            color="success"
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeeklyChart />
          <CategoryBreakdown />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">{t('analytics.progress_overview')}</h3>
            <div className="flex items-center justify-around">
              <CompletionRing
                percentage={completionRate}
                label={t('analytics.overall')}
                sublabel={t('analytics.completion')}
                size="lg"
              />
              <CompletionRing
                percentage={averageWeeklyProgress}
                label={t('analytics.this_week')}
                sublabel={t('analytics.progress')}
                size="lg"
                color="hsl(var(--accent))"
              />
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elevated p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('analytics.top_performing_habits')}</h3>

            {topHabits.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('dashboard.no_habits_yet')}</p>
            ) : (
              <div className="space-y-4">
                {topHabits.map((habit, index) => (
                  <div key={habit.id} className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{habit.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${habit.completionRate}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {Math.round(habit.completionRate)}%
                        </span>
                      </div>
                    </div>
                    <StreakIndicator streak={habit.currentStreak} size="sm" showLabel={false} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
