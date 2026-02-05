import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface SplashScreenProps {
    onAnimationComplete?: () => void;
    isExiting?: boolean;
}

export function SplashScreen({ onAnimationComplete, isExiting = false }: SplashScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
            <motion.div
                initial={isExiting ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={isExiting ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 2
                }}
                onAnimationComplete={() => {
                    if (isExiting && onAnimationComplete) {
                        onAnimationComplete();
                    }
                }}
                className="relative flex flex-col items-center"
            >
                <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
                    <Flame className="h-16 w-16 text-primary-foreground" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-4xl font-bold text-foreground">HabitFlow</h1>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
