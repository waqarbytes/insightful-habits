import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '@/context/HabitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, Check, Droplets, BookOpen, Moon, Sun, Brain, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HabitCategory } from '@/types/habit';

const STARTER_HABITS = [
    {
        id: 'water',
        name: 'Drink Water',
        description: 'Stay hydrated with 8 glasses a day',
        category: 'health' as HabitCategory,
        icon: 'Droplets',
        color: '#3b82f6', // blue-500
        target: 8,
        unit: 'glasses',
        frequency: 'daily'
    },
    {
        id: 'read',
        name: 'Read Books',
        description: 'Read for 30 minutes',
        category: 'growth' as HabitCategory,
        icon: 'BookOpen',
        color: '#8b5cf6', // violet-500
        target: 30,
        unit: 'minutes',
        frequency: 'daily'
    },
    {
        id: 'meditate',
        name: 'Meditate',
        description: 'Mindfulness session',
        category: 'wellness' as HabitCategory,
        icon: 'Brain',
        color: '#10b981', // emerald-500
        target: 10,
        unit: 'minutes',
        frequency: 'daily'
    },
    {
        id: 'exercise',
        name: 'Exercise',
        description: 'Physical activity',
        category: 'health' as HabitCategory,
        icon: 'Dumbbell',
        color: '#f43f5e', // rose-500
        target: 45,
        unit: 'minutes',
        frequency: 'daily'
    },
    {
        id: 'sleep',
        name: 'Sleep Early',
        description: 'Get 8 hours of sleep',
        category: 'health' as HabitCategory,
        icon: 'Moon',
        color: '#6366f1', // indigo-500
        target: 8,
        unit: 'hours',
        frequency: 'daily'
    },
    {
        id: 'journal',
        name: 'Journaling',
        description: 'Reflect on your day',
        category: 'mindfulness' as HabitCategory,
        icon: 'Pen',
        color: '#f59e0b', // amber-500
        target: 1,
        unit: 'custom',
        frequency: 'daily'
    }
];

export default function Onboarding() {
    const { updateProfile, addHabit, profile } = useHabits();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        dob: '',
        wakeTime: '',
        bedTime: ''
    });

    const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

    const handleNext = () => {
        if (step === 1) {
            if (!formData.dob || !formData.wakeTime || !formData.bedTime) {
                toast.error('Please fill in all fields');
                return;
            }
            setStep(2);
        } else {
            handleComplete();
        }
    };

    const toggleHabit = (id: string) => {
        setSelectedHabits(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            // 1. Update Profile
            const { error: profileError } = await updateProfile({
                date_of_birth: formData.dob,
                wake_up_time: formData.wakeTime,
                bed_time: formData.bedTime,
                onboarding_completed: true
            });

            if (profileError) throw new Error(profileError);

            // 2. Add Selected Habits
            const habitsToAdd = STARTER_HABITS.filter(h => selectedHabits.includes(h.id));

            for (const habit of habitsToAdd) {
                // Remove the temporary 'id' and add clean object
                const { id, ...habitData } = habit;
                await addHabit({
                    ...habitData,
                    unit: habitData.unit as any, // Cast to any to satisfy strict type check temporarily
                    frequency: 'daily' // Ensure frequency matches allowed type
                });
            }

            toast.success("All set! Welcome to your dashboard.");
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Onboarding error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Droplets': return <Droplets className="w-6 h-6" />;
            case 'BookOpen': return <BookOpen className="w-6 h-6" />;
            case 'Brain': return <Brain className="w-6 h-6" />;
            case 'Dumbbell': return <Dumbbell className="w-6 h-6" />;
            case 'Moon': return <Moon className="w-6 h-6" />;
            default: return <Sun className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                layout
                className="w-full max-w-2xl"
            >
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 justify-center">
                    <div className={cn("h-1 w-16 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-1 w-16 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 text-center"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">Tell us about yourself</h1>
                                <p className="text-muted-foreground">This helps us personalize your experience.</p>
                            </div>

                            <div className="grid gap-6 text-left max-w-md mx-auto bg-card p-6 rounded-2xl border shadow-sm">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Wake Up Time</Label>
                                        <Input
                                            type="time"
                                            value={formData.wakeTime}
                                            onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bed Time</Label>
                                        <Input
                                            type="time"
                                            value={formData.bedTime}
                                            onChange={(e) => setFormData({ ...formData, bedTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleNext} size="lg" className="w-full max-w-md btn-gradient">
                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">Choose your focus</h1>
                                <p className="text-muted-foreground">Select habits you want to start with (optional).</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {STARTER_HABITS.map((habit) => (
                                    <motion.div
                                        key={habit.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleHabit(habit.id)}
                                        className={cn(
                                            "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left",
                                            selectedHabits.includes(habit.id)
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-transparent bg-card hover:bg-muted/50"
                                        )}
                                    >
                                        <div
                                            className="p-3 rounded-full shrink-0 transition-colors"
                                            style={{
                                                backgroundColor: selectedHabits.includes(habit.id) ? habit.color : '#e5e7eb',
                                                color: selectedHabits.includes(habit.id) ? 'white' : '#6b7280'
                                            }}
                                        >
                                            {getIcon(habit.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{habit.name}</h3>
                                            <p className="text-xs text-muted-foreground">{habit.description}</p>
                                        </div>
                                        {selectedHabits.includes(habit.id) && (
                                            <div className="ml-auto bg-primary text-primary-foreground rounded-full p-1">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <Button
                                onClick={handleComplete}
                                size="lg"
                                className="w-full max-w-md btn-gradient"
                                disabled={loading}
                            >
                                {loading ? 'Setting up...' : 'Get Started'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
