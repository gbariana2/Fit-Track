import { WorkoutState } from './types';
import { DEFAULT_SETTINGS } from './constants';

const STORAGE_KEY = 'workout-tracker-data';
const DRAFT_KEY = 'workout-tracker-draft';

export const DEFAULT_STATE: WorkoutState = {
  workouts: [],
  templates: [],
  settings: DEFAULT_SETTINGS,
};

export function loadState(): WorkoutState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as WorkoutState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: WorkoutState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadDraft<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveDraft<T>(data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY);
}
