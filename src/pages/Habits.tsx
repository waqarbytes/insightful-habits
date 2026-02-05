import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHabits } from '@/context/HabitContext';
import { HabitCategory } from '@/types/habit';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function Habits() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { t } = useTranslation();

  const { getAllHabitsWithStats } = useHabits();
  const habits = getAllHabitsWithStats();

  const categories = [
    { value: 'all', label: t('habits.all_categories') },
    { value: 'health', label: t('habits.health') },
    { value: 'fitness', label: t('habits.fitness') },
    { value: 'mindfulness', label: t('habits.mindfulness') },
    { value: 'productivity', label: t('habits.productivity') },
    { value: 'learning', label: t('habits.learning') },
    { value: 'social', label: t('habits.social') },
  ];

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(search.toLowerCase()) ||
      habit.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || habit.category === category;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('habits.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('habits.subtitle')}
            </p>
          </div>

          <AddHabitDialog />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('habits.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Habits list/grid */}
        {filteredHabits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-elevated p-12 text-center"
          >
            <p className="text-muted-foreground">
              {habits.length === 0
                ? t('habits.no_habits_created')
                : t('habits.no_habits_match')
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
