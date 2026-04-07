import { Workout, WorkoutTemplate } from './types';

/**
 * Suggests which template to do today based on rotation.
 * Looks at the most recent workouts and finds which template
 * was used least recently, suggesting a round-robin rotation.
 */
export function suggestTodayTemplate(
  workouts: Workout[],
  templates: WorkoutTemplate[]
): WorkoutTemplate | null {
  if (templates.length === 0) return null;
  if (workouts.length === 0) return templates[0];

  // For each template, find the most recent date it was effectively used.
  // Match by checking if a workout's exercises overlap significantly with a template.
  const templateLastUsed = templates.map((template) => {
    const templateExerciseNames = new Set(template.exercises.map((e) => e.name));

    let lastDate = '';
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));

    for (const workout of sorted) {
      const workoutNames = workout.exercises.map((e) => e.name);
      const overlap = workoutNames.filter((n) => templateExerciseNames.has(n)).length;
      // Consider it a match if at least half the template exercises were done
      if (overlap >= Math.ceil(templateExerciseNames.size / 2)) {
        lastDate = workout.date;
        break;
      }
    }

    return { template, lastDate };
  });

  // Sort by last used date ascending (oldest first = most due)
  templateLastUsed.sort((a, b) => {
    if (!a.lastDate) return -1; // never used = highest priority
    if (!b.lastDate) return 1;
    return a.lastDate.localeCompare(b.lastDate);
  });

  return templateLastUsed[0].template;
}

/**
 * Gets a time-of-day greeting.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Checks if the user already worked out today.
 */
export function hasWorkedOutToday(workouts: Workout[]): boolean {
  const today = new Date().toISOString().split('T')[0];
  return workouts.some((w) => w.date === today);
}
