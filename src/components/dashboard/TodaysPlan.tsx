'use client';

import Link from 'next/link';
import { WorkoutTemplate } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface TodaysPlanProps {
  template: WorkoutTemplate | null;
  hasWorkedOut: boolean;
  onStartWorkout: (template: WorkoutTemplate) => void;
}

export default function TodaysPlan({ template, hasWorkedOut, onStartWorkout }: TodaysPlanProps) {
  if (hasWorkedOut) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-emerald-950/20 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">You crushed it today</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400/80">Rest up and recover — you earned it.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Ready to train?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Create a workout plan to get personalized daily suggestions.
            </p>
          </div>
          <Link href="/templates">
            <Button variant="secondary">Create Plan</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-200/60 dark:border-sky-800/30 bg-gradient-to-br from-sky-50 via-white to-cyan-50/30 dark:from-sky-950/40 dark:via-zinc-900 dark:to-cyan-950/20 p-6 gradient-mesh">
      {/* Decorative circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-sky-200/20 dark:bg-sky-500/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1.5">
              Up Next
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {template.name}
            </h3>
            {template.description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {template.description}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {template.exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center gap-1.5 bg-white/70 dark:bg-zinc-800/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-zinc-200/50 dark:border-zinc-700/50"
            >
              <Badge muscleGroup={ex.muscleGroup} className="shrink-0" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {ex.name}
              </span>
            </div>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={() => onStartWorkout(template)}>
          Start Workout
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
