'use client';

import { useState } from 'react';
import { WorkoutTemplate, TemplateExercise } from '@/lib/types';
import { ExerciseTemplate } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ExerciseSearch from '@/components/log/ExerciseSearch';
import TemplateExerciseRow from './TemplateExerciseRow';

interface TemplateFormProps {
  initial?: WorkoutTemplate;
  onSave: (template: WorkoutTemplate) => void;
  onCancel: () => void;
}

export default function TemplateForm({ initial, onSave, onCancel }: TemplateFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [exercises, setExercises] = useState<TemplateExercise[]>(
    initial?.exercises || []
  );
  const [showSearch, setShowSearch] = useState(false);

  const handleAddExercise = (template: ExerciseTemplate) => {
    const newExercise: TemplateExercise = {
      id: crypto.randomUUID(),
      name: template.name,
      muscleGroup: template.muscleGroup,
      defaultSets: 3,
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const handleUpdate = (index: number, exercise: TemplateExercise) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? exercise : ex)));
  };

  const handleDelete = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;
    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExercises(updated);
  };

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    onSave({
      id: initial?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      exercises,
      createdAt: initial?.createdAt || new Date().toISOString(),
    });
  };

  const canSave = name.trim().length > 0 && exercises.length > 0;

  return (
    <div className="space-y-4">
      {/* Name & description */}
      <Card>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day, Pull Day, Leg Day"
              className="w-full bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Chest, shoulders, and triceps"
              className="w-full bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Exercise list */}
      {exercises.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Exercises ({exercises.length})
          </h3>
          {exercises.map((exercise, index) => (
            <TemplateExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              total={exercises.length}
              onChange={(ex) => handleUpdate(index, ex)}
              onDelete={() => handleDelete(index)}
              onMoveUp={() => handleMove(index, 'up')}
              onMoveDown={() => handleMove(index, 'down')}
            />
          ))}
        </div>
      )}

      {/* Add exercise */}
      <button
        onClick={() => setShowSearch(true)}
        className="w-full border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-sky-400 hover:text-sky-600 dark:hover:border-sky-500 dark:hover:text-sky-400 transition-colors"
      >
        <svg className="w-5 h-5 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Exercise
      </button>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
          {initial ? 'Update Template' : 'Save Template'}
        </Button>
      </div>

      <ExerciseSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}
