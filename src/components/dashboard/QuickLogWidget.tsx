import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { HabitIcon } from '@/components/icons/HabitIcon';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function QuickLogWidget() {
  const { getAllHabitsWithStats, logHabit } = useHabits();
  const habits = getAllHabitsWithStats();

  const handleQuickComplete = (habitId: string, habitName: string, target: number, currentValue: number) => {
    if (currentValue >= target) return;
    
    logHabit(habitId, target);
    toast({
      title: "🎉 Habit Complete!",
      description: `Great job completing "${habitName}"!`,
    });
  };

  const incompleteHabits = habits.filter(h => h.todayValue < h.target);
  const completedCount = habits.filter(h => h.todayValue >= h.target).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Quick Log</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{habits.length} habits completed today
          </p>
        </div>
      </div>

      {incompleteHabits.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-success" />
          </div>
          <p className="font-semibold text-success">All done for today!</p>
          <p className="text-sm text-muted-foreground mt-1">Great work keeping your streak!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {incompleteHabits.slice(0, 5).map((habit, index) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    <HabitIcon name={habit.icon} size={16} style={{ color: habit.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{habit.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {habit.todayValue}/{habit.target} {habit.unit}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQuickComplete(habit.id, habit.name, habit.target, habit.todayValue)}
                  className="h-8 w-8 p-0 hover:bg-success/20 hover:text-success"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {incompleteHabits.length > 5 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              +{incompleteHabits.length - 5} more habits
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
