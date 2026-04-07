'use client';

import { useState, useMemo } from 'react';
import { MuscleGroup } from '@/lib/types';
import { EXERCISE_LIST, MUSCLE_GROUP_LABELS, ExerciseTemplate } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

interface ExerciseSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseTemplate) => void;
}

export default function ExerciseSearch({ isOpen, onClose, onSelect }: ExerciseSearchProps) {
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customGroup, setCustomGroup] = useState<MuscleGroup>('other');

  const filtered = useMemo(() => {
    if (!search.trim()) return EXERCISE_LIST;
    const q = search.toLowerCase();
    return EXERCISE_LIST.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.muscleGroup.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, ExerciseTemplate[]> = {};
    for (const ex of filtered) {
      if (!groups[ex.muscleGroup]) groups[ex.muscleGroup] = [];
      groups[ex.muscleGroup].push(ex);
    }
    return groups;
  }, [filtered]);

  const handleSelect = (ex: ExerciseTemplate) => {
    onSelect(ex);
    setSearch('');
    onClose();
  };

  const handleCustom = () => {
    if (!customName.trim()) return;
    onSelect({ name: customName.trim(), muscleGroup: customGroup });
    setCustomName('');
    setCustomGroup('other');
    setSearch('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise">
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          autoFocus
          className="w-full bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />

        {/* Exercise list */}
        <div className="max-h-60 overflow-y-auto -mx-4 px-4">
          {Object.entries(grouped).map(([group, exercises]) => (
            <div key={group} className="mb-3">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                {MUSCLE_GROUP_LABELS[group as MuscleGroup]}
              </div>
              {exercises.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => handleSelect(ex)}
                  className="flex items-center justify-between w-full px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span>{ex.name}</span>
                  <Badge muscleGroup={ex.muscleGroup} />
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No exercises found. Add a custom one below.
            </p>
          )}
        </div>

        {/* Custom exercise */}
        <div className="border-t border-gray-200 dark:border-neutral-800 pt-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Custom Exercise
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Exercise name"
              className="flex-1 bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <select
              value={customGroup}
              onChange={(e) => setCustomGroup(e.target.value as MuscleGroup)}
              className="bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {Object.entries(MUSCLE_GROUP_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCustom}
            disabled={!customName.trim()}
            className="mt-2 w-full px-3 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Custom Exercise
          </button>
        </div>
      </div>
    </Modal>
  );
}
