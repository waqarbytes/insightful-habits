import { motion } from 'framer-motion';
import { Check, Plus, Minus, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { HabitWithStats } from '@/types/habit';
import { HabitIcon } from '@/components/icons/HabitIcon';
import { StreakIndicator } from './StreakIndicator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useHabits } from '@/context/HabitContext';
import { toast } from '@/hooks/use-toast';

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit?: () => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { logHabit, deleteHabit } = useHabits();
  const progress = (habit.todayValue / habit.target) * 100;
  const isComplete = habit.todayValue >= habit.target;

  const handleIncrement = () => {
    const newValue = Math.min(habit.todayValue + 1, habit.target * 2);
    logHabit(habit.id, newValue);
    
    if (newValue >= habit.target && habit.todayValue < habit.target) {
      toast({
        title: "🎉 Habit Complete!",
        description: `Great job completing "${habit.name}"!`,
      });
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max(habit.todayValue - 1, 0);
    logHabit(habit.id, newValue);
  };

  const handleComplete = () => {
    if (!isComplete) {
      logHabit(habit.id, habit.target);
      toast({
        title: "🎉 Habit Complete!",
        description: `Great job completing "${habit.name}"!`,
      });
    }
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    toast({
      title: "Habit deleted",
      description: `"${habit.name}" has been removed.`,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        'card-elevated p-5 transition-all duration-300',
        isComplete && 'ring-2 ring-success/30 bg-success/5'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <HabitIcon name={habit.icon} size={24} style={{ color: habit.color }} />
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">
              {habit.todayValue} / {habit.target} {habit.unit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StreakIndicator streak={habit.currentStreak} size="sm" showLabel={false} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={Math.min(progress, 100)} 
          className="h-2"
          style={{ 
            '--progress-background': habit.color + '30',
            '--progress-foreground': habit.color,
          } as React.CSSProperties}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleDecrement}
            disabled={habit.todayValue === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant={isComplete ? "default" : "outline"}
            onClick={handleComplete}
            className={cn(
              'transition-all duration-300',
              isComplete && 'bg-success hover:bg-success/90'
            )}
          >
            <Check className={cn('mr-2 h-4 w-4', isComplete && 'animate-bounce-subtle')} />
            {isComplete ? 'Completed!' : 'Mark Complete'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
