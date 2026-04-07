import { Workout, OverloadMode, ProgressiveTarget, MuscleGroup } from './types';
import { OVERLOAD_MODE_CONFIG } from './constants';

/**
 * Rounds weight to the nearest practical plate increment.
 * - Under 50 lbs: round to nearest 2.5
 * - 50+ lbs: round to nearest 5
 */
function roundWeight(weight: number, unit: 'lbs' | 'kg'): number {
  if (weight <= 0) return 0;
  if (unit === 'kg') {
    return Math.round(weight / 2.5) * 2.5;
  }
  const increment = weight < 50 ? 2.5 : 5;
  return Math.round(weight / increment) * increment;
}

/** Upper body muscle groups get smaller weight jumps than lower body. */
const UPPER_BODY: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];

function isUpperBody(muscleGroup: MuscleGroup): boolean {
  return UPPER_BODY.includes(muscleGroup);
}

interface LastSessionData {
  avgWeight: number;
  avgReps: number;
  minReps: number;  // lowest rep count across sets
  maxReps: number;  // highest rep count across sets
  setCount: number;
  date: string;
  muscleGroup: MuscleGroup;
}

/**
 * Gets the most recent workout data for a given exercise name.
 */
function getLastSession(workouts: Workout[], exerciseName: string): LastSessionData | null {
  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));

  for (const workout of sorted) {
    const exercise = workout.exercises.find((e) => e.name === exerciseName);
    if (exercise && exercise.sets.length > 0) {
      const workingSets = exercise.sets.filter((s) => s.weight > 0 && s.reps > 0);
      if (workingSets.length === 0) continue;

      const reps = workingSets.map((s) => s.reps);
      return {
        avgWeight: workingSets.reduce((sum, s) => sum + s.weight, 0) / workingSets.length,
        avgReps: workingSets.reduce((sum, s) => sum + s.reps, 0) / workingSets.length,
        minReps: Math.min(...reps),
        maxReps: Math.max(...reps),
        setCount: workingSets.length,
        date: workout.date,
        muscleGroup: exercise.muscleGroup,
      };
    }
  }

  return null;
}

/**
 * Double-progression progressive overload calculation.
 *
 * The principle:
 * 1. You work within a rep range (e.g. 8-12 for manageable).
 * 2. Each session, try to add 1 rep to your sets compared to last time.
 * 3. Once you can hit the TOP of the rep range on all sets, it's time to
 *    increase weight by a small fixed amount and reset to the bottom of the range.
 * 4. If you're still in the middle of the range, just add +1 rep — same weight.
 *
 * This means weight only goes up every few weeks, not every session.
 */
export function calculateProgressiveTarget(
  workouts: Workout[],
  exerciseName: string,
  mode: OverloadMode,
  fallbackWeight?: number,
  fallbackReps?: number,
  unit: 'lbs' | 'kg' = 'lbs'
): ProgressiveTarget {
  const last = getLastSession(workouts, exerciseName);
  const config = OVERLOAD_MODE_CONFIG[mode];
  const [repMin, repMax] = config.repRange;

  if (!last) {
    return {
      weight: fallbackWeight || 0,
      reps: fallbackReps || repMin,
      lastWeight: 0,
      lastReps: 0,
      isNew: true,
      hint: 'First time — start with a comfortable weight',
    };
  }

  const lastWeight = roundWeight(last.avgWeight, unit);
  const lastReps = Math.round(last.avgReps);

  // Did they hit the top of the rep range on all sets last session?
  const hitRepCeiling = last.minReps >= repMax;

  if (hitRepCeiling) {
    // Graduate: increase weight, reset reps to bottom of range
    const upper = isUpperBody(last.muscleGroup);
    const bump = unit === 'kg'
      ? (upper ? config.weightBumpUpperKg : config.weightBumpLowerKg)
      : (upper ? config.weightBumpUpper : config.weightBumpLower);
    const newWeight = roundWeight(lastWeight + bump, unit);

    return {
      weight: newWeight,
      reps: repMin,
      lastWeight,
      lastReps,
      isNew: false,
      hint: `Hit ${repMax} reps last time — add weight, reset to ${repMin} reps`,
    };
  }

  // Still building reps at current weight
  const nextReps = Math.min(lastReps + 1, repMax);

  if (nextReps === lastReps) {
    // Already at top of range but minReps wasn't there — keep grinding
    return {
      weight: lastWeight,
      reps: lastReps,
      lastWeight,
      lastReps,
      isNew: false,
      hint: `Hit ${repMax} reps on every set to unlock a weight increase`,
    };
  }

  return {
    weight: lastWeight,
    reps: nextReps,
    lastWeight,
    lastReps,
    isNew: false,
    hint: `Building reps — aim for ${nextReps} across all sets (${repMin}-${repMax} range)`,
  };
}

/**
 * Calculates targets for all exercises in a template.
 */
export function calculateTemplateTargets(
  workouts: Workout[],
  exerciseNames: string[],
  mode: OverloadMode,
  defaults?: { weight?: number; reps?: number }[],
  unit: 'lbs' | 'kg' = 'lbs'
): ProgressiveTarget[] {
  return exerciseNames.map((name, i) =>
    calculateProgressiveTarget(
      workouts,
      name,
      mode,
      defaults?.[i]?.weight,
      defaults?.[i]?.reps,
      unit
    )
  );
}
