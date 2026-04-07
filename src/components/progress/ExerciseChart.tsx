'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatDateShort } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface DataPoint {
  date: string;
  maxWeight: number;
  totalVolume: number;
  totalSets: number;
}

interface ExerciseChartProps {
  data: DataPoint[];
  exerciseName: string;
}

export default function ExerciseChart({ data, exerciseName }: ExerciseChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No data for {exerciseName} in this time range.
        </p>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatDateShort(d.date),
  }));

  return (
    <Card className="p-2 sm:p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 px-2">
        {exerciseName} — Weight & Volume
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            yAxisId="weight"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#9ca3af' } }}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Volume', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#9ca3af' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg, #fff)',
              border: '1px solid var(--card-border, #e5e7eb)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="maxWeight"
            name="Max Weight"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="volume"
            type="monotone"
            dataKey="totalVolume"
            name="Total Volume"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
