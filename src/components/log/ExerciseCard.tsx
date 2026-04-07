'use client';

import { Exercise, WorkoutSet, ProgressiveTarget } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SetRow from './SetRow';

interface ExerciseCardProps {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onDelete: () => void;
  defaultUnit: 'lbs' | 'kg';
  target?: ProgressiveTarget;
}

export default function ExerciseCard({ exercise, onChange, onDelete, defaultUnit, target }: ExerciseCardProps) {
  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      unit: defaultUnit,
    };
    onChange({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const updateSet = (index: number, set: WorkoutSet) => {
    const sets = [...exercise.sets];
    sets[index] = set;
    onChange({ ...exercise, sets });
  };

  const deleteSet = (index: number) => {
    onChange({ ...exercise, sets: exercise.sets.filter((_, i) => i !== index) });
  };

  const weightChanged = target && !target.isNew && target.weight !== target.lastWeight;
  const repsChanged = target && !target.isNew && target.reps !== target.lastReps;

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
          <Badge muscleGroup={exercise.muscleGroup} />
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progressive target indicator */}
      {target && !target.isNew && (
        <div className="mb-3 px-2.5 py-2 rounded-lg bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium text-sky-700 dark:text-sky-400">
              {target.hint}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pl-5.5">
            <span>
              Last: {target.lastWeight} {defaultUnit} x {target.lastReps}
            </span>
            <span className="text-gray-300 dark:text-neutral-600">|</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Target: {target.weight} {defaultUnit} x {target.reps}
              {weightChanged && (
                <span className="ml-1 text-sky-600 dark:text-sky-400">
                  (+{target.weight - target.lastWeight} {defaultUnit})
                </span>
              )}
              {!weightChanged && repsChanged && (
                <span className="ml-1 text-sky-600 dark:text-sky-400">
                  (+{target.reps - target.lastReps} rep{target.reps - target.lastReps > 1 ? 's' : ''})
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 px-0">
        <div className="w-6 shrink-0" />
        <div className="flex-1 text-xs font-medium text-gray-500 dark:text-gray-400">Weight</div>
        <div className="flex-1 text-xs font-medium text-gray-500 dark:text-gray-400">Reps</div>
        <div className="w-8 shrink-0" />
      </div>

      <div className="space-y-2">
        {exercise.sets.map((set, i) => (
          <SetRow
            key={set.id}
            index={i}
            set={set}
            onChange={(s) => updateSet(i, s)}
            onDelete={() => deleteSet(i)}
            showDelete={exercise.sets.length > 1}
          />
        ))}
      </div>

      <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={addSet}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Set
      </Button>
    </Card>
  );
}
