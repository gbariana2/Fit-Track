'use client';

import { PersonalRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { isRecentPR } from '@/lib/records';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface RecordCardProps {
  record: PersonalRecord;
}

export default function RecordCard({ record }: RecordCardProps) {
  const stats: { label: string; value: string; suffix: string; date: string; isGoal?: boolean }[] = [
    {
      label: 'Max Weight',
      value: `${record.maxWeight.value}`,
      suffix: record.maxWeight.unit,
      date: record.maxWeight.date,
    },
    {
      label: 'Max Reps',
      value: `${record.maxReps.value}`,
      suffix: `@ ${record.maxReps.weight} lbs`,
      date: record.maxReps.date,
    },
    ...(record.estimated1RM.value > 0
      ? [
          {
            label: '1RM Goal',
            value: `${record.estimated1RM.value}`,
            suffix: 'lbs',
            date: record.estimated1RM.date,
            isGoal: true,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{record.exerciseName}</h3>
          <Badge muscleGroup={record.muscleGroup} />
        </div>
        {stats.some((s) => isRecentPR(s.date)) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            NEW
          </span>
        )}
      </div>

      <div className={`grid gap-3 ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {stats.map((stat) => (
          <div key={stat.label} className={`relative min-w-0 ${stat.isGoal ? 'bg-sky-50 dark:bg-sky-950/20 rounded-xl px-2.5 py-2 -mx-0.5' : ''}`}>
            <p className={`text-xs font-medium truncate ${stat.isGoal ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {stat.isGoal ? '🎯 ' : ''}{stat.label}
            </p>
            <p className={`text-lg font-bold mt-0.5 truncate ${stat.isGoal ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}>
              {stat.value}
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">
                {stat.suffix}
              </span>
            </p>
            {stat.date && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(stat.date)}
              </p>
            )}
            {isRecentPR(stat.date) && !stat.isGoal && (
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
