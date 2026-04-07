'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { PageTransition, ScrollReveal } from '@/components/ui/Animate';
import TimeRangeSelector from '@/components/progress/TimeRangeSelector';
import ExerciseChart from '@/components/progress/ExerciseChart';
import CategoryChart from '@/components/progress/CategoryChart';
import ScoreChart from '@/components/progress/ScoreChart';
import { useWorkouts } from '@/hooks/useWorkouts';
import { TimeRange } from '@/lib/types';
import { getExerciseProgressData, getMuscleGroupVolume, getUniqueExerciseNames, filterWorkoutsByRange } from '@/lib/utils';
import { computeScoreHistory, computeWorkoutScore, getScoreColor, getScoreLabel } from '@/lib/score';

export default function ProgressPage() {
  const { workouts, isLoaded } = useWorkouts();
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [view, setView] = useState<'score' | 'exercise' | 'category'>('score');

  const exerciseNames = useMemo(() => getUniqueExerciseNames(workouts), [workouts]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const activeExercise = selectedExercise || exerciseNames[0] || '';

  const filteredWorkouts = useMemo(
    () => filterWorkoutsByRange(workouts, timeRange),
    [workouts, timeRange]
  );

  const exerciseData = useMemo(
    () => (activeExercise ? getExerciseProgressData(workouts, activeExercise, timeRange) : []),
    [workouts, activeExercise, timeRange]
  );

  const categoryData = useMemo(
    () => getMuscleGroupVolume(workouts, timeRange),
    [workouts, timeRange]
  );

  const scoreData = useMemo(() => {
    const allScores = computeScoreHistory(workouts);
    const rangeFiltered = filterWorkoutsByRange(workouts, timeRange);
    const rangeDates = new Set(rangeFiltered.map((w) => w.date));
    return allScores.filter((s) => rangeDates.has(s.date));
  }, [workouts, timeRange]);

  // Latest workout score
  const latestScore = useMemo(() => {
    if (workouts.length === 0) return null;
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
    return computeWorkoutScore(sorted[0], workouts);
  }, [workouts]);

  if (!isLoaded) {
    return <div className="shimmer h-96 rounded-2xl" />;
  }

  if (workouts.length === 0) {
    return (
      <PageTransition>
        <PageHeader title="Progress" subtitle="Track your gains over time" />
        <EmptyState
          title="No data yet"
          description="Log some workouts to see your progress charts here."
          actionLabel="Log Workout"
          actionHref="/log"
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title="Progress" subtitle="Track your gains over time" />

      {/* Latest score banner */}
      {latestScore !== null && (
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-sm shadow-sky-500/20">
            <span className="text-xl font-black text-white">{latestScore}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              Last Workout Score: <span className={getScoreColor(latestScore)}>{getScoreLabel(latestScore)}</span>
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Based on volume relative to your personal bests
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

          <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
            {(['score', 'exercise', 'category'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  view === v
                    ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {v === 'score' ? 'Workout Score' : v === 'exercise' ? 'By Exercise' : 'By Muscle Group'}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise selector */}
        {view === 'exercise' && (
          <select
            value={activeExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {exerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}

        {/* Charts */}
        <ScrollReveal>
          {view === 'score' && <ScoreChart data={scoreData} />}
          {view === 'exercise' && <ExerciseChart data={exerciseData} exerciseName={activeExercise} />}
          {view === 'category' && <CategoryChart data={categoryData} />}
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
