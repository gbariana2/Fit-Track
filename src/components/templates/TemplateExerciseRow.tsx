'use client';

import { TemplateExercise } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface TemplateExerciseRowProps {
  exercise: TemplateExercise;
  index: number;
  total: number;
  onChange: (exercise: TemplateExercise) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function TemplateExerciseRow({
  exercise,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: TemplateExerciseRowProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800/30 rounded-lg p-3 group">
      {/* Reorder buttons */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Exercise info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {exercise.name}
          </span>
          <Badge muscleGroup={exercise.muscleGroup} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Sets:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={exercise.defaultSets}
              onChange={(e) =>
                onChange({ ...exercise, defaultSets: parseInt(e.target.value) || 1 })
              }
              className="w-14 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded px-2 py-1 text-xs text-gray-900 dark:text-white text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Reps:</label>
            <input
              type="number"
              min="0"
              value={exercise.defaultReps || ''}
              onChange={(e) =>
                onChange({ ...exercise, defaultReps: parseInt(e.target.value) || undefined })
              }
              placeholder="-"
              className="w-14 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded px-2 py-1 text-xs text-gray-900 dark:text-white text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Weight:</label>
            <input
              type="number"
              min="0"
              step="5"
              value={exercise.defaultWeight || ''}
              onChange={(e) =>
                onChange({ ...exercise, defaultWeight: parseFloat(e.target.value) || undefined })
              }
              placeholder="-"
              className="w-16 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded px-2 py-1 text-xs text-gray-900 dark:text-white text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
