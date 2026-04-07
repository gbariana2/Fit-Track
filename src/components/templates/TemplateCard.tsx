'use client';

import { WorkoutTemplate } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface TemplateCardProps {
  template: WorkoutTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
}

export default function TemplateCard({ template, onEdit, onDelete, onUse }: TemplateCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
          {template.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{template.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Exercise list preview */}
      <div className="space-y-1 mb-3">
        {template.exercises.map((ex, i) => (
          <div key={ex.id} className="flex items-center gap-2 text-sm">
            <span className="text-xs text-gray-400 dark:text-gray-500 w-4 text-right shrink-0">
              {i + 1}.
            </span>
            <span className="text-gray-700 dark:text-gray-300 truncate">{ex.name}</span>
            <Badge muscleGroup={ex.muscleGroup} className="shrink-0" />
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">
              {ex.defaultSets} sets
              {ex.defaultReps ? ` x ${ex.defaultReps}` : ''}
            </span>
          </div>
        ))}
      </div>

      <Button size="sm" className="w-full" onClick={onUse}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Start Workout
      </Button>
    </Card>
  );
}
