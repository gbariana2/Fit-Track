'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { Workout, WorkoutTemplate, UserSettings, WorkoutState } from '@/lib/types';
import { loadState, saveState, DEFAULT_STATE } from '@/lib/storage';

export interface WorkoutContextValue {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  settings: UserSettings;
  isLoaded: boolean;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  updateTemplate: (id: string, template: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  loadFullState: (state: WorkoutState) => void;
}

export const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkoutState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadState();
    // Migrate old state that may not have templates or overloadMode
    setState({
      ...DEFAULT_STATE,
      ...saved,
      templates: saved.templates || [],
      settings: { ...DEFAULT_STATE.settings, ...saved.settings },
    });
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  const addWorkout = useCallback((workout: Workout) => {
    setState((prev) => ({
      ...prev,
      workouts: [...prev.workouts, workout],
    }));
  }, []);

  const updateWorkout = useCallback((id: string, workout: Workout) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => (w.id === id ? workout : w)),
    }));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== id),
    }));
  }, []);

  const addTemplate = useCallback((template: WorkoutTemplate) => {
    setState((prev) => ({
      ...prev,
      templates: [...prev.templates, template],
    }));
  }, []);

  const updateTemplate = useCallback((id: string, template: WorkoutTemplate) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((t) => (t.id === id ? template : t)),
    }));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const loadFullState = useCallback((newState: WorkoutState) => {
    setState(newState);
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workouts: state.workouts,
        templates: state.templates,
        settings: state.settings,
        isLoaded,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        updateSettings,
        loadFullState,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
