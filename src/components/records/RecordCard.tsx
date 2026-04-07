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
  const stats = [
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
    {
      label: 'Best Volume',
      value: record.maxVolume.value >= 1000
        ? `${(record.maxVolume.value / 1000).toFixed(1)}k`
        : `${record.maxVolume.value}`,
      suffix: 'lbs',
      date: record.maxVolume.date,
    },
    ...(record.estimated1RM.value > 0
      ? [
          {
            label: 'Est. 1RM',
            value: `${record.estimated1RM.value}`,
            suffix: 'lbs',
            date: record.estimated1RM.date,
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

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="relative">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
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
            {isRecentPR(stat.date) && (
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
