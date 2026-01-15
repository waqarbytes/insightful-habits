import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CompletionRingProps {
  percentage: number;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function CompletionRing({ 
  percentage, 
  label, 
  sublabel,
  size = 'md',
  color = 'hsl(var(--primary))'
}: CompletionRingProps) {
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  const sizes = {
    sm: { width: 80, height: 80, innerRadius: 28, outerRadius: 36 },
    md: { width: 120, height: 120, innerRadius: 42, outerRadius: 54 },
    lg: { width: 160, height: 160, innerRadius: 58, outerRadius: 74 },
  };

  const config = sizes[size];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}`}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className={`font-medium text-foreground ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
