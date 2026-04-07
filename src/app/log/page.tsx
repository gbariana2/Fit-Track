'use client';

import PageHeader from '@/components/layout/PageHeader';
import WorkoutForm from '@/components/log/WorkoutForm';
import { PageTransition } from '@/components/ui/Animate';

export default function LogWorkoutPage() {
  return (
    <PageTransition>
      <PageHeader title="Log Workout" subtitle="Record your exercises, sets, and reps" />
      <WorkoutForm />
    </PageTransition>
  );
}
