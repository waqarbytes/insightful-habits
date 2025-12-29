import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakIndicatorProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export function StreakIndicator({ 
  streak, 
  size = 'md', 
  showLabel = true,
  animate = true 
}: StreakIndicatorProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  if (streak === 0) {
    return (
      <div className={cn(
        'flex items-center gap-2',
        size === 'sm' && 'gap-1'
      )}>
        <div className={cn(
          'rounded-full bg-muted flex items-center justify-center',
          sizeClasses[size]
        )}>
          <Flame size={iconSizes[size]} className="text-muted-foreground" />
        </div>
        {showLabel && (
          <span className="text-muted-foreground font-medium">No streak</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2',
      size === 'sm' && 'gap-1'
    )}>
      <motion.div
        initial={animate ? { scale: 0.8 } : false}
        animate={animate ? { scale: 1 } : false}
        className={cn(
          'rounded-full flex items-center justify-center relative overflow-hidden',
          sizeClasses[size],
          streak >= 7 ? 'streak-glow' : ''
        )}
        style={{
          background: streak >= 30 
            ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
            : streak >= 7 
              ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
              : 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
        }}
      >
        <motion.div
          animate={animate && streak >= 7 ? {
            scale: [1, 1.1, 1],
            rotate: [-3, 3, -3],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Flame 
            size={iconSizes[size]} 
            className="text-white drop-shadow-md" 
            fill="currentColor"
          />
        </motion.div>
        
        {streak >= 30 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      {showLabel && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold',
            streak >= 30 ? 'gradient-accent-text' : 'text-foreground',
            size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm'
          )}>
            {streak} {streak === 1 ? 'day' : 'days'}
          </span>
          {size === 'lg' && (
            <span className="text-sm text-muted-foreground">
              {streak >= 30 ? 'On fire! 🔥' : streak >= 7 ? 'Great streak!' : 'Keep going!'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
