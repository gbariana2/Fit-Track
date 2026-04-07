'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatDateShort } from '@/lib/utils';
import { getScoreLabel } from '@/lib/score';
import Card from '@/components/ui/Card';

interface ScoreData {
  date: string;
  score: number;
  label: string;
}

interface ScoreChartProps {
  data: ScoreData[];
}

export default function ScoreChart({ data }: ScoreChartProps) {
  if (data.length === 0) {
    return (
      <Card variant="elevated" className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No workout scores yet.
        </p>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDateShort(d.date),
  }));

  const avgScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);

  return (
    <Card variant="elevated" className="p-2 sm:p-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          Workout Score Trend
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Avg:</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{avgScore}</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">({getScoreLabel(avgScore)})</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-zinc-800" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#a1a1aa" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg, #fff)',
              border: '1px solid var(--card-border, #e5e7eb)',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${Number(value)} — ${getScoreLabel(Number(value))}`, 'Score']}
            labelFormatter={(label) => `${label}`}
          />
          <ReferenceLine y={avgScore} stroke="#a1a1aa" strokeDasharray="4 4" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
            dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
