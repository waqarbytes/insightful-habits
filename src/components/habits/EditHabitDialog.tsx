import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Habit, HabitCategory, HabitUnit } from '@/types/habit';
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

interface EditHabitDialogProps {
    habit: Habit;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
    const { updateHabit } = useHabits();

    const [name, setName] = useState(habit.name);
    const [description, setDescription] = useState(habit.description || '');
    const [category, setCategory] = useState<HabitCategory>(habit.category);
    const [icon, setIcon] = useState(habit.icon);
    const [color, setColor] = useState(habit.color);
    const [target, setTarget] = useState(habit.target.toString());
    const [unit, setUnit] = useState<HabitUnit>(habit.unit);

    useEffect(() => {
        if (open) {
            setName(habit.name);
            setDescription(habit.description || '');
            setCategory(habit.category);
            setIcon(habit.icon);
            setColor(habit.color);
            setTarget(habit.target.toString());
            setUnit(habit.unit);
        }
    }, [open, habit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a habit name",
                variant: "destructive",
            });
            return;
        }

        await updateHabit(habit.id, {
            name: name.trim(),
            description: description.trim() || undefined,
            category,
            icon,
            color,
            target: parseInt(target) || 1,
            unit,
        });

        toast({
            title: "Habit updated",
            description: `"${name}" has been updated successfully.`,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: color + '20' }}
                        >
                            <HabitIcon name={icon} size={20} style={{ color }} />
                        </div>
                        Edit Habit
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Habit Name</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Drink water"
                            maxLength={50}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description (optional)</Label>
                        <Textarea
                            id="edit-description"
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
                        <Label htmlFor="edit-target">Daily Target</Label>
                        <Input
                            id="edit-target"
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
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${icon === iconName
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
                                    className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-foreground' : ''
                                        }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-gradient">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
