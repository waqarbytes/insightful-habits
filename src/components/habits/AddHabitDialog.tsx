import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HabitIcon, availableIcons } from '@/components/icons/HabitIcon';
import { useHabits } from '@/context/HabitContext';
import { HabitCategory, HabitUnit } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

const categories: { value: HabitCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'learning', label: 'Learning' },
  { value: 'social', label: 'Social' },
];

const units: { value: HabitUnit; label: string }[] = [
  { value: 'times', label: 'Times' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'glasses', label: 'Glasses' },
  { value: 'steps', label: 'Steps' },
  { value: 'pages', label: 'Pages' },
];

const colors = [
  '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
];

interface AddHabitDialogProps {
  trigger?: React.ReactNode;
}

export function AddHabitDialog({ trigger }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const { addHabit } = useHabits();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState(colors[0]);
  const [target, setTarget] = useState('1');
  const [unit, setUnit] = useState<HabitUnit>('times');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    addHabit({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      icon,
      color,
      target: parseInt(target) || 1,
      unit,
      frequency: 'daily',
    });

    toast({
      title: "Habit created!",
      description: `"${name}" has been added to your habits.`,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('health');
    setIcon('Target');
    setColor(colors[0]);
    setTarget('1');
    setUnit('times');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-gradient">
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: color + '20' }}
            >
              <HabitIcon name={icon} size={20} style={{ color }} />
            </div>
            Create New Habit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your habit"
              rows={2}
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as HabitCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as HabitUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Daily Target</Label>
            <Input
              id="target"
              type="number"
              min="1"
              max="1000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map((iconName) => (
                <motion.button
                  key={iconName}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIcon(iconName)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    icon === iconName 
                      ? 'ring-2 ring-primary' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  style={icon === iconName ? { backgroundColor: color + '20' } : {}}
                >
                  <HabitIcon 
                    name={iconName} 
                    size={20} 
                    style={{ color: icon === iconName ? color : undefined }} 
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
