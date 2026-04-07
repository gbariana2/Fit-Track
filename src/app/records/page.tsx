'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { PageTransition, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Animate';
import RecordCard from '@/components/records/RecordCard';
import RecordFilters from '@/components/records/RecordFilters';
import { useWorkouts } from '@/hooks/useWorkouts';
import { computeAllPRs } from '@/lib/records';
import { MuscleGroup } from '@/lib/types';

export default function RecordsPage() {
  const { workouts, isLoaded } = useWorkouts();
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);

  const allPRs = useMemo(() => computeAllPRs(workouts), [workouts]);

  const availableGroups = useMemo(() => {
    const groups = new Set(allPRs.map((pr) => pr.muscleGroup));
    return Array.from(groups) as MuscleGroup[];
  }, [allPRs]);

  const filteredPRs = useMemo(() => {
    if (selectedGroups.length === 0) return allPRs;
    return allPRs.filter((pr) => selectedGroups.includes(pr.muscleGroup));
  }, [allPRs, selectedGroups]);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-40 bg-gray-100 dark:bg-neutral-900 rounded-xl" />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <PageTransition>
        <PageHeader title="Personal Records" subtitle="Your all-time bests" />
        <EmptyState
          title="No records yet"
          description="Log some workouts and your personal records will appear here."
          actionLabel="Log Workout"
          actionHref="/log"
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title="Personal Records" subtitle="Your all-time bests" />

      <div className="space-y-4">
        <RecordFilters
          selected={selectedGroups}
          onChange={setSelectedGroups}
          availableGroups={availableGroups}
        />

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {filteredPRs.map((record) => (
            <StaggerItem key={record.exerciseName}>
              <HoverLift>
                <RecordCard record={record} />
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredPRs.length === 0 && selectedGroups.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            No records for the selected muscle groups.
          </p>
        )}
      </div>
    </PageTransition>
  );
}
