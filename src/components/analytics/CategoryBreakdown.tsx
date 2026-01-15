import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useHabits } from '@/context/HabitContext';
import { HabitCategory } from '@/types/habit';

const categoryColors: Record<HabitCategory, string> = {
  health: '#0EA5E9',
  fitness: '#10B981',
  mindfulness: '#8B5CF6',
  productivity: '#F59E0B',
  learning: '#EF4444',
  social: '#EC4899',
};

const categoryLabels: Record<HabitCategory, string> = {
  health: 'Health',
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
  productivity: 'Productivity',
  learning: 'Learning',
  social: 'Social',
};

export function CategoryBreakdown() {
  const { getCategoryStats } = useHabits();
  const stats = getCategoryStats();

  const data = stats.map(s => ({
    name: categoryLabels[s.category],
    value: s.count,
    completion: Math.round(s.avgCompletion),
    color: categoryColors[s.category],
  }));

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
        <p className="text-muted-foreground text-center py-8">No habits yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} habits (${props.payload.completion}% avg)`,
                name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
