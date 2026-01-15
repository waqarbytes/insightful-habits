import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function InsightsWidget() {
    const { habits } = useHabits();
    const [insights, setInsights] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const analyzeHabits = async () => {
        if (habits.length === 0) {
            toast.error("Add some habits first to get insights!");
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-habits', {
                body: { habits },
            });

            if (error) throw error;
            setInsights(data.insights);
        } catch (error) {
            console.error('Error analyzing habits:', error);
            toast.error("Failed to analyze habits. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-lg">Analytical Assistant</h3>
                    </div>

                    <Button
                        onClick={analyzeHabits}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Generate Insights
                            </>
                        )}
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    {insights ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 rounded-lg p-4"
                        >
                            <div className="whitespace-pre-wrap font-medium leading-relaxed">
                                {insights}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 p-4 rounded-lg border border-dashed">
                            <AlertCircle className="w-4 h-4" />
                            Click "Generate Insights" to get an honest analysis of your habit patterns.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
