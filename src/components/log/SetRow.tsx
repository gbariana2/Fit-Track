'use client';

import { WorkoutSet } from '@/lib/types';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  onChange: (set: WorkoutSet) => void;
  onDelete: () => void;
  showDelete: boolean;
}

export default function SetRow({ index, set, onChange, onDelete, showDelete }: SetRowProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 w-6 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={set.weight || ''}
            onChange={(e) => onChange({ ...set, weight: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            className="w-full bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {set.unit}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={set.reps || ''}
            onChange={(e) => onChange({ ...set, reps: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-full bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            reps
          </span>
        </div>
      </div>
      {showDelete ? (
        <button
          onClick={onDelete}
          className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ) : (
        <div className="w-8 shrink-0" />
      )}
    </div>
  );
}
