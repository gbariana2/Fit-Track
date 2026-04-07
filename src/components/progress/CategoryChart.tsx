'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MuscleGroup } from '@/lib/types';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_CHART_COLORS } from '@/lib/constants';
import Card from '@/components/ui/Card';

interface CategoryData {
  muscleGroup: MuscleGroup;
  volume: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No volume data yet.
        </p>
      </Card>
    );
  }

  const chartData = data
    .map((d) => ({
      name: MUSCLE_GROUP_LABELS[d.muscleGroup],
      volume: d.volume,
      muscleGroup: d.muscleGroup,
    }))
    .sort((a, b) => b.volume - a.volume);

  return (
    <Card className="p-2 sm:p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 px-2">
        Volume by Muscle Group
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg, #fff)',
              border: '1px solid var(--card-border, #e5e7eb)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${Number(value).toLocaleString()} lbs`, 'Volume']}
          />
          <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={MUSCLE_GROUP_CHART_COLORS[entry.muscleGroup]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
