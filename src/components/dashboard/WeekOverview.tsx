'use client';

import { Workout } from '@/lib/types';
import { getWeekDates, getDayLabel } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface WeekOverviewProps {
  workouts: Workout[];
}

export default function WeekOverview({ workouts }: WeekOverviewProps) {
  const weekDates = getWeekDates();
  const workoutDates = new Set(workouts.map((w) => w.date));
  const today = new Date().toISOString().split('T')[0];
  const completedCount = weekDates.filter((d) => workoutDates.has(d)).length;

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
          This Week
        </h3>
        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-full">
          {completedCount}/7 days
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {weekDates.map((date) => {
          const hasWorkout = workoutDates.has(date);
          const isToday = date === today;
          const isFuture = date > today;

          return (
            <div key={date} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[11px] font-semibold tracking-wide ${isToday ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {getDayLabel(date)}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  hasWorkout
                    ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-sm shadow-sky-500/25'
                    : isToday
                    ? 'border-2 border-sky-400 dark:border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30'
                    : isFuture
                    ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-600'
                    : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {hasWorkout ? (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">
                    {new Date(date + 'T00:00:00').getDate()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
