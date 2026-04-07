import { Workout, PersonalRecord, MuscleGroup } from './types';

export function computeAllPRs(workouts: Workout[]): PersonalRecord[] {
  const prMap = new Map<
    string,
    {
      muscleGroup: MuscleGroup;
      maxWeight: { value: number; unit: string; date: string };
      maxReps: { value: number; weight: number; date: string };
      maxVolume: { value: number; date: string };
      estimated1RM: { value: number; date: string };
    }
  >();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const existing = prMap.get(exercise.name) || {
        muscleGroup: exercise.muscleGroup,
        maxWeight: { value: 0, unit: 'lbs', date: '' },
        maxReps: { value: 0, weight: 0, date: '' },
        maxVolume: { value: 0, date: '' },
        estimated1RM: { value: 0, date: '' },
      };

      for (const set of exercise.sets) {
        // Max weight
        if (set.weight > existing.maxWeight.value) {
          existing.maxWeight = { value: set.weight, unit: set.unit, date: workout.date };
        }

        // Max reps
        if (set.reps > existing.maxReps.value) {
          existing.maxReps = { value: set.reps, weight: set.weight, date: workout.date };
        }

        // Max volume (single set)
        const volume = set.weight * set.reps;
        if (volume > existing.maxVolume.value) {
          existing.maxVolume = { value: volume, date: workout.date };
        }

        // Estimated 1RM (Epley formula, only for reps <= 10)
        if (set.reps > 0 && set.reps <= 10 && set.weight > 0) {
          const e1rm = set.weight * (1 + set.reps / 30);
          if (e1rm > existing.estimated1RM.value) {
            existing.estimated1RM = { value: Math.round(e1rm), date: workout.date };
          }
        }
      }

      prMap.set(exercise.name, existing);
    }
  }

  return Array.from(prMap.entries())
    .map(([name, data]) => ({
      exerciseName: name,
      ...data,
    }))
    .sort((a, b) => {
      // Sort by most recent PR date
      const aDate = Math.max(
        ...[a.maxWeight.date, a.maxReps.date, a.maxVolume.date, a.estimated1RM.date]
          .filter(Boolean)
          .map((d) => new Date(d).getTime())
      );
      const bDate = Math.max(
        ...[b.maxWeight.date, b.maxReps.date, b.maxVolume.date, b.estimated1RM.date]
          .filter(Boolean)
          .map((d) => new Date(d).getTime())
      );
      return bDate - aDate;
    });
}

export function isRecentPR(dateStr: string): boolean {
  if (!dateStr) return false;
  const prDate = new Date(dateStr);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return prDate >= weekAgo;
}
