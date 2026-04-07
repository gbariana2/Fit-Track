import { Workout } from './types';

/**
 * Workout Score — a normalized 0-100 score measuring relative performance.
 *
 * For each exercise in a workout, we compute volume (weight x reps summed
 * across sets). We then compare this to the user's historical best volume
 * for that same exercise. The exercise scores are averaged to get the
 * workout score.
 *
 * Score interpretation:
 *   90-100  — PR territory, best or near-best session
 *   75-89   — strong session, above your average
 *   60-74   — solid session, around your typical performance
 *   40-59   — light day or deload
 *   0-39    — warmup or very light session
 */

interface ExerciseVolume {
  name: string;
  volume: number;
}

function getExerciseVolumes(workout: Workout): ExerciseVolume[] {
  return workout.exercises.map((ex) => ({
    name: ex.name,
    volume: ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
  }));
}

/**
 * Computes the workout score for a single workout relative to all historical
 * workouts. Returns a number 0-100.
 */
export function computeWorkoutScore(
  workout: Workout,
  allWorkouts: Workout[]
): number {
  const exerciseVolumes = getExerciseVolumes(workout);
  if (exerciseVolumes.length === 0) return 0;

  // Build a map of best-ever volume per exercise from history
  const bestVolume = new Map<string, number>();
  for (const w of allWorkouts) {
    for (const ex of w.exercises) {
      const vol = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      const current = bestVolume.get(ex.name) || 0;
      if (vol > current) bestVolume.set(ex.name, vol);
    }
  }

  // Score each exercise as a percentage of its best-ever volume
  let totalScore = 0;
  let scored = 0;

  for (const ev of exerciseVolumes) {
    const best = bestVolume.get(ev.name);
    if (!best || best === 0) {
      // First time doing this exercise — give it a 75 (decent baseline)
      totalScore += 75;
    } else {
      // Cap at 100 — if they beat their record, it's still 100
      totalScore += Math.min(100, Math.round((ev.volume / best) * 100));
    }
    scored++;
  }

  return scored > 0 ? Math.round(totalScore / scored) : 0;
}

/**
 * Computes workout scores for all workouts, sorted by date.
 * Returns data ready for charting.
 */
export function computeScoreHistory(
  workouts: Workout[]
): { date: string; score: number; label: string }[] {
  // Sort chronologically
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));

  // For each workout, compute its score relative to ALL workouts up to that point
  // (so scores are relative to the user's history at that time)
  return sorted.map((workout, i) => {
    const historyUpToNow = sorted.slice(0, i + 1);
    const score = computeWorkoutScore(workout, historyUpToNow);

    // Create a short label for the workout
    const exerciseNames = workout.exercises.map((e) => e.name);
    const mainExercise = exerciseNames[0] || 'Workout';
    const label = exerciseNames.length > 1
      ? `${mainExercise} +${exerciseNames.length - 1}`
      : mainExercise;

    return { date: workout.date, score, label };
  });
}

/**
 * Returns a color class based on score tier.
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 75) return 'text-sky-600 dark:text-sky-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-zinc-500 dark:text-zinc-400';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Solid';
  if (score >= 40) return 'Light';
  return 'Easy';
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50';
  if (score >= 75) return 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50';
  if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
  return 'bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800';
}
