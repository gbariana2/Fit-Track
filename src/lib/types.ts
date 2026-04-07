export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'other';

export type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

export type OverloadMode = 'aggressive' | 'manageable' | 'chill';

export interface ProgressiveTarget {
  weight: number;
  reps: number;
  lastWeight: number;
  lastReps: number;
  isNew: boolean; // true if no history exists
  hint: string;   // explains why this target was suggested
}

export interface PersonalRecord {
  exerciseName: string;
  muscleGroup: MuscleGroup;
  maxWeight: { value: number; unit: string; date: string };
  maxReps: { value: number; weight: number; date: string };
  maxVolume: { value: number; date: string };
  estimated1RM: { value: number; date: string };
}

export interface DailyVolume {
  date: string;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
}

export interface UserSettings {
  defaultUnit: 'lbs' | 'kg';
  theme: 'light' | 'dark';
  overloadMode: OverloadMode;
  userName: string;
}

export interface TemplateExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  defaultSets: number;
  defaultReps?: number;
  defaultWeight?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: TemplateExercise[];
  createdAt: string;
}

export interface WorkoutState {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  settings: UserSettings;
}
