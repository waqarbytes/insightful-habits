import { 
  Droplets, 
  Dumbbell, 
  Brain, 
  BookOpen, 
  Moon, 
  Heart, 
  Flame,
  Target,
  Coffee,
  Apple,
  Footprints,
  Pencil,
  Music,
  Sun,
  Zap,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Dumbbell,
  Brain,
  BookOpen,
  Moon,
  Heart,
  Flame,
  Target,
  Coffee,
  Apple,
  Footprints,
  Pencil,
  Music,
  Sun,
  Zap,
};

interface HabitIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function HabitIcon({ name, size = 24, className, style }: HabitIconProps) {
  const Icon = iconMap[name] || Target;
  return <Icon size={size} className={className} style={style} />;
}

export const availableIcons = Object.keys(iconMap);
