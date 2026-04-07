'use client';

import Link from 'next/link';
import { Workout } from '@/lib/types';
import { formatDate, getWorkoutVolume, getWorkoutTotalSets } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  const recent = [...workouts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <Card variant="elevated" className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <Link
          href="/log"
          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
        >
          Log New +
        </Link>
      </div>
      <div>
        {recent.map((workout, i) => (
          <Link
            key={workout.id}
            href={`/workout/${workout.id}`}
            className={`px-5 py-3.5 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${
              i < recent.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''
            }`}
          >
            {/* Date column */}
            <div className="w-14 shrink-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                {new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                {new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
            </div>

            {/* Badges */}
            <div className="flex-1 flex flex-wrap gap-1 min-w-0">
              {workout.exercises.slice(0, 4).map((ex) => (
                <Badge key={ex.id} muscleGroup={ex.muscleGroup} />
              ))}
              {workout.exercises.length > 4 && (
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5">
                  +{workout.exercises.length - 4}
                </span>
              )}
            </div>

            {/* Stats + arrow */}
            <div className="text-right shrink-0 flex items-center gap-2">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  {getWorkoutTotalSets(workout)} sets
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  {getWorkoutVolume(workout).toLocaleString()} lbs
                </p>
              </div>
              <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
