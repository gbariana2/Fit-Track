import { MuscleGroup } from './types';

export interface ExerciseTemplate {
  name: string;
  muscleGroup: MuscleGroup;
}

export const EXERCISE_LIST: ExerciseTemplate[] = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'chest' },
  { name: 'Incline Bench Press', muscleGroup: 'chest' },
  { name: 'Decline Bench Press', muscleGroup: 'chest' },
  { name: 'Dumbbell Fly', muscleGroup: 'chest' },
  { name: 'Cable Crossover', muscleGroup: 'chest' },
  { name: 'Push-Up', muscleGroup: 'chest' },
  { name: 'Chest Dip', muscleGroup: 'chest' },

  // Back
  { name: 'Deadlift', muscleGroup: 'back' },
  { name: 'Barbell Row', muscleGroup: 'back' },
  { name: 'Pull-Up', muscleGroup: 'back' },
  { name: 'Lat Pulldown', muscleGroup: 'back' },
  { name: 'Seated Cable Row', muscleGroup: 'back' },
  { name: 'T-Bar Row', muscleGroup: 'back' },
  { name: 'Dumbbell Row', muscleGroup: 'back' },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders' },
  { name: 'Lateral Raise', muscleGroup: 'shoulders' },
  { name: 'Front Raise', muscleGroup: 'shoulders' },
  { name: 'Face Pull', muscleGroup: 'shoulders' },
  { name: 'Arnold Press', muscleGroup: 'shoulders' },
  { name: 'Reverse Fly', muscleGroup: 'shoulders' },

  // Biceps
  { name: 'Barbell Curl', muscleGroup: 'biceps' },
  { name: 'Dumbbell Curl', muscleGroup: 'biceps' },
  { name: 'Hammer Curl', muscleGroup: 'biceps' },
  { name: 'Preacher Curl', muscleGroup: 'biceps' },
  { name: 'Cable Curl', muscleGroup: 'biceps' },
  { name: 'Concentration Curl', muscleGroup: 'biceps' },

  // Triceps
  { name: 'Tricep Pushdown', muscleGroup: 'triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps' },
  { name: 'Skull Crusher', muscleGroup: 'triceps' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'triceps' },
  { name: 'Tricep Dip', muscleGroup: 'triceps' },
  { name: 'Diamond Push-Up', muscleGroup: 'triceps' },

  // Legs
  { name: 'Squat', muscleGroup: 'legs' },
  { name: 'Front Squat', muscleGroup: 'legs' },
  { name: 'Leg Press', muscleGroup: 'legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs' },
  { name: 'Lunges', muscleGroup: 'legs' },
  { name: 'Leg Curl', muscleGroup: 'legs' },
  { name: 'Leg Extension', muscleGroup: 'legs' },
  { name: 'Calf Raise', muscleGroup: 'legs' },
  { name: 'Hip Thrust', muscleGroup: 'legs' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs' },

  // Core
  { name: 'Plank', muscleGroup: 'core' },
  { name: 'Crunch', muscleGroup: 'core' },
  { name: 'Russian Twist', muscleGroup: 'core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'core' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'core' },
  { name: 'Cable Woodchop', muscleGroup: 'core' },

  // Cardio
  { name: 'Running', muscleGroup: 'cardio' },
  { name: 'Cycling', muscleGroup: 'cardio' },
  { name: 'Rowing Machine', muscleGroup: 'cardio' },
  { name: 'Jump Rope', muscleGroup: 'cardio' },
  { name: 'Stair Climber', muscleGroup: 'cardio' },
];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  core: 'Core',
  cardio: 'Cardio',
  other: 'Other',
};

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  back: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shoulders: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  biceps: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  triceps: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  legs: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  core: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  cardio: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export const MUSCLE_GROUP_CHART_COLORS: Record<MuscleGroup, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  shoulders: '#f59e0b',
  biceps: '#8b5cf6',
  triceps: '#ec4899',
  legs: '#22c55e',
  core: '#f97316',
  cardio: '#14b8a6',
  other: '#6b7280',
};

export const DEFAULT_SETTINGS = {
  defaultUnit: 'lbs' as const,
  theme: 'light' as const,
  overloadMode: 'manageable' as const,
  userName: '',
};

/**
 * Progressive overload mode configs based on double progression method.
 *
 * How it works: each exercise has a rep range (e.g. 8-12). You start at the
 * bottom of the range with a given weight. Each session you try to add reps.
 * Once you hit the top of the range on all sets, you increase weight and
 * reset to the bottom of the range.
 *
 * The three modes control:
 * - repRange: the working rep range [min, max]
 * - weightBump: how much to add when graduating (upper body / lower body)
 * - description: user-facing explanation
 */
export const OVERLOAD_MODE_CONFIG = {
  aggressive: {
    label: 'Aggressive',
    description: 'Shorter rep range (6-8), bigger weight jumps. Add weight once you hit 8 reps on all sets.',
    repRange: [6, 8] as [number, number],
    weightBumpUpper: 10,  // lbs for upper body
    weightBumpLower: 15,  // lbs for lower body
    weightBumpUpperKg: 5,
    weightBumpLowerKg: 7.5,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  },
  manageable: {
    label: 'Manageable',
    description: 'Standard rep range (8-12), moderate weight jumps. Add weight once you hit 12 reps on all sets.',
    repRange: [8, 12] as [number, number],
    weightBumpUpper: 5,
    weightBumpLower: 10,
    weightBumpUpperKg: 2.5,
    weightBumpLowerKg: 5,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
  },
  chill: {
    label: 'Chill',
    description: 'Wider rep range (10-15), small weight jumps. Plenty of room to build before adding weight.',
    repRange: [10, 15] as [number, number],
    weightBumpUpper: 5,
    weightBumpLower: 5,
    weightBumpUpperKg: 2.5,
    weightBumpLowerKg: 2.5,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  },
} as const;
