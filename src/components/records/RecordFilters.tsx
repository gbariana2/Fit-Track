'use client';

import { MuscleGroup } from '@/lib/types';
import { MUSCLE_GROUP_LABELS } from '@/lib/constants';

interface RecordFiltersProps {
  selected: MuscleGroup[];
  onChange: (groups: MuscleGroup[]) => void;
  availableGroups: MuscleGroup[];
}

export default function RecordFilters({ selected, onChange, availableGroups }: RecordFiltersProps) {
  const toggle = (group: MuscleGroup) => {
    if (selected.includes(group)) {
      onChange(selected.filter((g) => g !== group));
    } else {
      onChange([...selected, group]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange([])}
        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
          selected.length === 0
            ? 'bg-sky-600 text-white'
            : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800'
        }`}
      >
        All
      </button>
      {availableGroups.map((group) => (
        <button
          key={group}
          onClick={() => toggle(group)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            selected.includes(group)
              ? 'bg-sky-600 text-white'
              : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800'
          }`}
        >
          {MUSCLE_GROUP_LABELS[group]}
        </button>
      ))}
    </div>
  );
}
