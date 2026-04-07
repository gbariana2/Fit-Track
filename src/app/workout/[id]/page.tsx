'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useWorkouts } from '@/hooks/useWorkouts';
import { formatDate, getWorkoutVolume, getWorkoutTotalSets, getWorkoutTotalReps } from '@/lib/utils';
import { computeWorkoutScore, getScoreColor, getScoreLabel, getScoreBg } from '@/lib/score';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Animate';

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { workouts, isLoaded } = useWorkouts();

  const workout = useMemo(
    () => workouts.find((w) => w.id === id),
    [workouts, id]
  );

  const score = useMemo(
    () => (workout ? computeWorkoutScore(workout, workouts) : 0),
    [workout, workouts]
  );

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="shimmer h-20 rounded-2xl" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Workout not found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">This workout may have been deleted.</p>
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const totalSets = getWorkoutTotalSets(workout);
  const totalReps = getWorkoutTotalReps(workout);
  const totalVolume = getWorkoutVolume(workout);
  const dayOfWeek = new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">{dayOfWeek}</p>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            {formatDate(workout.date)}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Score badge */}
        <div className={`flex flex-col items-center px-4 py-3 rounded-2xl border ${getScoreBg(score)}`}>
          <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
          <span className={`text-xs font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalSets}</p>
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Sets</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalReps.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Reps</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
          </p>
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Volume (lbs)</p>
        </Card>
      </div>

      {/* Exercise breakdown */}
      <StaggerContainer className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
          Exercises
        </h2>
        {workout.exercises.map((exercise) => {
          const exVolume = exercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
          return (
            <StaggerItem key={exercise.id}>
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{exercise.name}</h3>
                  <Badge muscleGroup={exercise.muscleGroup} />
                </div>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {exVolume.toLocaleString()} lbs
                </span>
              </div>

              {/* Sets table */}
              <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-4 gap-0 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span>Set</span>
                  <span>Weight</span>
                  <span>Reps</span>
                  <span className="text-right">Volume</span>
                </div>
                {exercise.sets.map((set, i) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-4 gap-0 px-3 py-2 text-sm ${
                      i % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50/50 dark:bg-zinc-800/20'
                    }`}
                  >
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">{i + 1}</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {set.weight > 0 ? `${set.weight} ${set.unit}` : 'BW'}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{set.reps}</span>
                    <span className="text-right text-zinc-500 dark:text-zinc-400">
                      {(set.weight * set.reps).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {exercise.notes && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 italic">
                  {exercise.notes}
                </p>
              )}
            </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
    </PageTransition>
  );
}
