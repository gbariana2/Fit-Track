import { Workout, MuscleGroup, TimeRange } from './types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getDateRangeStart(range: TimeRange): string | null {
  if (range === 'ALL') return null;
  const now = new Date();
  switch (range) {
    case '1W':
      now.setDate(now.getDate() - 7);
      break;
    case '1M':
      now.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      now.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      now.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now.toISOString().split('T')[0];
}

export function filterWorkoutsByRange(workouts: Workout[], range: TimeRange): Workout[] {
  const start = getDateRangeStart(range);
  if (!start) return workouts;
  return workouts.filter((w) => w.date >= start);
}

export function getWorkoutVolume(workout: Workout): number {
  return workout.exercises.reduce(
    (total, ex) =>
      total + ex.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
    0
  );
}

export function getWorkoutTotalSets(workout: Workout): number {
  return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

export function getWorkoutTotalReps(workout: Workout): number {
  return workout.exercises.reduce(
    (total, ex) => total + ex.sets.reduce((sum, set) => sum + set.reps, 0),
    0
  );
}

export function getExerciseProgressData(
  workouts: Workout[],
  exerciseName: string,
  range: TimeRange
) {
  const filtered = filterWorkoutsByRange(workouts, range)
    .filter((w) => w.exercises.some((e) => e.name === exerciseName))
    .sort((a, b) => a.date.localeCompare(b.date));

  return filtered.map((w) => {
    const exercise = w.exercises.find((e) => e.name === exerciseName)!;
    const maxWeight = Math.max(...exercise.sets.map((s) => s.weight));
    const totalVolume = exercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    const totalSets = exercise.sets.length;
    return {
      date: w.date,
      maxWeight,
      totalVolume,
      totalSets,
    };
  });
}

export function getMuscleGroupVolume(workouts: Workout[], range: TimeRange) {
  const filtered = filterWorkoutsByRange(workouts, range);
  const volumeMap: Record<string, number> = {};

  for (const w of filtered) {
    for (const ex of w.exercises) {
      const vol = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      volumeMap[ex.muscleGroup] = (volumeMap[ex.muscleGroup] || 0) + vol;
    }
  }

  return Object.entries(volumeMap).map(([group, volume]) => ({
    muscleGroup: group as MuscleGroup,
    volume,
  }));
}

export function getUniqueExerciseNames(workouts: Workout[]): string[] {
  const names = new Set<string>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      names.add(ex.name);
    }
  }
  return Array.from(names).sort();
}

export function calculateStreak(workouts: Workout[]): { current: number; longest: number } {
  if (workouts.length === 0) return { current: 0, longest: 0 };

  const dates = new Set(workouts.map((w) => w.date));
  const sortedDates = Array.from(dates).sort().reverse();

  const today = getTodayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  // Current streak
  let current = 0;
  let checkDate = dates.has(today) ? today : yesterdayISO;
  if (!dates.has(checkDate)) {
    current = 0;
  } else {
    const d = new Date(checkDate + 'T00:00:00');
    while (dates.has(d.toISOString().split('T')[0])) {
      current++;
      d.setDate(d.getDate() - 1);
    }
  }

  // Longest streak
  let longest = 0;
  let streak = 1;
  const allDates = Array.from(dates).sort();
  for (let i = 1; i < allDates.length; i++) {
    const prev = new Date(allDates[i - 1] + 'T00:00:00');
    const curr = new Date(allDates[i] + 'T00:00:00');
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
