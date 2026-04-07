'use client';

import { useContext } from 'react';
import { WorkoutContext, WorkoutContextValue } from '@/context/WorkoutContext';

export function useWorkouts(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkouts must be used within WorkoutProvider');
  return ctx;
}
