'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise, Workout, WorkoutTemplate, OverloadMode, ProgressiveTarget } from '@/lib/types';
import { ExerciseTemplate } from '@/lib/constants';
import { useWorkouts } from '@/hooks/useWorkouts';
import { getTodayISO } from '@/lib/utils';
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage';
import { calculateProgressiveTarget } from '@/lib/overload';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ExerciseCard from './ExerciseCard';
import ExerciseSearch from './ExerciseSearch';
import OverloadModeSelector from './OverloadModeSelector';

interface DraftState {
  date: string;
  exercises: Exercise[];
}

function templateToExercisesWithTargets(
  template: WorkoutTemplate,
  workouts: Workout[],
  unit: 'lbs' | 'kg',
  mode: OverloadMode
): { exercises: Exercise[]; targets: Map<string, ProgressiveTarget> } {
  const targets = new Map<string, ProgressiveTarget>();

  const exercises = template.exercises.map((tex) => {
    const target = calculateProgressiveTarget(
      workouts,
      tex.name,
      mode,
      tex.defaultWeight,
      tex.defaultReps,
      unit
    );
    const exerciseId = crypto.randomUUID();
    targets.set(exerciseId, target);

    return {
      id: exerciseId,
      name: tex.name,
      muscleGroup: tex.muscleGroup,
      sets: Array.from({ length: tex.defaultSets }, () => ({
        id: crypto.randomUUID(),
        reps: target.reps,
        weight: target.weight,
        unit,
      })),
    };
  });

  return { exercises, targets };
}

export default function WorkoutForm() {
  const router = useRouter();
  const { addWorkout, workouts, templates, settings, updateSettings } = useWorkouts();
  const [date, setDate] = useState(getTodayISO());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadedTemplateName, setLoadedTemplateName] = useState<string | null>(null);
  const [targetMap, setTargetMap] = useState<Map<string, ProgressiveTarget>>(new Map());
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load draft or template from sessionStorage — runs once after context hydrates
  useEffect(() => {
    if (initialLoadDone || !templates || !workouts) return;

    const templateId = sessionStorage.getItem('workout-tracker-load-template');
    if (templateId) {
      sessionStorage.removeItem('workout-tracker-load-template');
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const { exercises: exs, targets } = templateToExercisesWithTargets(
          template,
          workouts,
          settings.defaultUnit,
          settings.overloadMode
        );
        setExercises(exs);
        setTargetMap(targets);
        setLoadedTemplateName(template.name);
        setInitialLoadDone(true);
        return;
      }
    }

    const draft = loadDraft<DraftState>();
    if (draft) {
      setDate(draft.date);
      setExercises(draft.exercises);
    }
    setInitialLoadDone(true);
  }, [initialLoadDone, templates, workouts, settings.defaultUnit, settings.overloadMode]);

  // Save draft
  useEffect(() => {
    if (exercises.length > 0) {
      saveDraft<DraftState>({ date, exercises });
    }
  }, [date, exercises]);

  const handleLoadTemplate = (template: WorkoutTemplate) => {
    const { exercises: exs, targets } = templateToExercisesWithTargets(
      template,
      workouts,
      settings.defaultUnit,
      settings.overloadMode
    );
    setExercises(exs);
    setTargetMap(targets);
    setLoadedTemplateName(template.name);
    setShowTemplates(false);
  };

  const handleModeChange = (mode: OverloadMode) => {
    updateSettings({ overloadMode: mode });

    if (exercises.length === 0) return;

    // If loaded from a template, fully recalculate from the template
    if (loadedTemplateName) {
      const template = templates.find((t) => t.name === loadedTemplateName);
      if (template) {
        const { exercises: exs, targets } = templateToExercisesWithTargets(
          template,
          workouts,
          settings.defaultUnit,
          mode
        );
        setExercises(exs);
        setTargetMap(targets);
        return;
      }
    }

    // Otherwise recalculate targets for individually-added exercises
    const newTargets = new Map<string, ProgressiveTarget>();
    const updatedExercises = exercises.map((ex) => {
      const target = calculateProgressiveTarget(workouts, ex.name, mode, undefined, undefined, settings.defaultUnit);
      if (!target.isNew) {
        newTargets.set(ex.id, target);
      }
      return {
        ...ex,
        sets: ex.sets.map((s) => ({
          ...s,
          weight: target.weight,
          reps: target.reps,
        })),
      };
    });
    setExercises(updatedExercises);
    setTargetMap(newTargets);
  };

  const handleAddExercise = (template: ExerciseTemplate) => {
    const target = calculateProgressiveTarget(
      workouts,
      template.name,
      settings.overloadMode,
      undefined,
      undefined,
      settings.defaultUnit
    );
    const exerciseId = crypto.randomUUID();

    const newExercise: Exercise = {
      id: exerciseId,
      name: template.name,
      muscleGroup: template.muscleGroup,
      sets: [
        {
          id: crypto.randomUUID(),
          reps: target.reps,
          weight: target.weight,
          unit: settings.defaultUnit,
        },
      ],
    };

    if (!target.isNew) {
      setTargetMap((prev) => new Map(prev).set(exerciseId, target));
    }

    setExercises((prev) => [...prev, newExercise]);
  };

  const handleUpdateExercise = (index: number, exercise: Exercise) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? exercise : ex)));
  };

  const handleDeleteExercise = (index: number) => {
    const removed = exercises[index];
    setTargetMap((prev) => {
      const next = new Map(prev);
      next.delete(removed.id);
      return next;
    });
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validExercises = exercises.filter(
      (ex) => ex.sets.length > 0 && ex.sets.some((s) => s.reps > 0 || s.weight > 0)
    );

    if (validExercises.length === 0) return;

    const workout: Workout = {
      id: crypto.randomUUID(),
      date,
      exercises: validExercises,
      createdAt: new Date().toISOString(),
    };

    addWorkout(workout);
    clearDraft();
    setSaved(true);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const canSave = exercises.some(
    (ex) => ex.sets.length > 0 && ex.sets.some((s) => s.reps > 0 || s.weight > 0)
  );

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Workout Saved!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overload mode selector */}
      <OverloadModeSelector
        value={settings.overloadMode}
        onChange={handleModeChange}
      />

      {/* Template selector banner */}
      {exercises.length === 0 && templates.length > 0 && !showTemplates && (
        <Card className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sky-900 dark:text-sky-300">
                Start from a template?
              </p>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-0.5">
                Targets auto-calculated from your history
              </p>
            </div>
            <Button size="sm" onClick={() => setShowTemplates(true)}>
              Choose Template
            </Button>
          </div>
        </Card>
      )}

      {/* Template picker */}
      {showTemplates && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select a Template
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-neutral-800/30 hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {template.exercises.length} exercises
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.exercises.map((ex) => (
                    <Badge key={ex.id} muscleGroup={ex.muscleGroup} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Loaded template indicator */}
      {loadedTemplateName && exercises.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Loaded from: {loadedTemplateName}
        </div>
      )}

      {/* Date picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getTodayISO()}
          className="w-full sm:w-auto bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      {/* Exercises */}
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onChange={(ex) => handleUpdateExercise(index, ex)}
          onDelete={() => handleDeleteExercise(index)}
          defaultUnit={settings.defaultUnit}
          target={targetMap.get(exercise.id)}
        />
      ))}

      {/* Add exercise button */}
      <button
        onClick={() => setShowSearch(true)}
        className="w-full border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-sky-400 hover:text-sky-600 dark:hover:border-sky-500 dark:hover:text-sky-400 transition-colors"
      >
        <svg className="w-5 h-5 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Exercise
      </button>

      {/* Save button */}
      {exercises.length > 0 && (
        <div className="sticky bottom-20 md:bottom-4 pt-4">
          <Button
            size="lg"
            className="w-full shadow-lg"
            onClick={handleSave}
            disabled={!canSave}
          >
            Save Workout
          </Button>
        </div>
      )}

      <ExerciseSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}
