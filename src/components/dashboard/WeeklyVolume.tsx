'use client';

import { Workout } from '@/lib/types';
import { getWeekDates, getWorkoutTotalSets, getWorkoutTotalReps, getWorkoutVolume } from '@/lib/utils';

interface WeeklyVolumeProps {
  workouts: Workout[];
}

export default function WeeklyVolume({ workouts }: WeeklyVolumeProps) {
  const weekDates = new Set(getWeekDates());
  const weekWorkouts = workouts.filter((w) => weekDates.has(w.date));

  const totalSets = weekWorkouts.reduce((sum, w) => sum + getWorkoutTotalSets(w), 0);
  const totalReps = weekWorkouts.reduce((sum, w) => sum + getWorkoutTotalReps(w), 0);
  const totalVolume = weekWorkouts.reduce((sum, w) => sum + getWorkoutVolume(w), 0);

  const stats = [
    { label: 'Workouts', value: weekWorkouts.length, icon: '🏋️' },
    { label: 'Total Sets', value: totalSets, icon: '📊' },
    { label: 'Total Reps', value: totalReps.toLocaleString(), icon: '🔄' },
    { label: 'Volume', value: totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toString(), suffix: 'lbs', icon: '💪' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 text-center hover:border-sky-200 dark:hover:border-sky-900/50 transition-colors"
        >
          <span className="text-lg mb-1 block">{stat.icon}</span>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {stat.value}
            {stat.suffix && (
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 ml-0.5">
                {stat.suffix}
              </span>
            )}
          </p>
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
