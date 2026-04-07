'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { PageTransition, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Animate';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import TemplateCard from '@/components/templates/TemplateCard';
import TemplateForm from '@/components/templates/TemplateForm';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutTemplate } from '@/lib/types';

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, isLoaded, addTemplate, updateTemplate, deleteTemplate } = useWorkouts();
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse h-40 bg-gray-100 dark:bg-neutral-900 rounded-xl" />
        ))}
      </div>
    );
  }

  if (mode === 'create' || mode === 'edit') {
    return (
      <>
        <PageHeader
          title={mode === 'create' ? 'New Template' : 'Edit Template'}
          subtitle={mode === 'create' ? 'Create a reusable workout plan' : 'Update your workout plan'}
        />
        <TemplateForm
          initial={editingTemplate || undefined}
          onSave={(template) => {
            if (mode === 'edit' && editingTemplate) {
              updateTemplate(editingTemplate.id, template);
            } else {
              addTemplate(template);
            }
            setMode('list');
            setEditingTemplate(null);
          }}
          onCancel={() => {
            setMode('list');
            setEditingTemplate(null);
          }}
        />
      </>
    );
  }

  const handleUseTemplate = (template: WorkoutTemplate) => {
    // Store template ID in sessionStorage so the log page can pick it up
    sessionStorage.setItem('workout-tracker-load-template', template.id);
    router.push('/log');
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Templates</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Reusable workout plans for quick logging
          </p>
        </div>
        <Button onClick={() => setMode('create')}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          title="No templates yet"
          description="Create workout templates like Push Day, Pull Day, or Leg Day to quickly start logging."
        />
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <StaggerItem key={template.id}>
              <HoverLift>
                <TemplateCard
                  template={template}
                  onEdit={() => {
                    setEditingTemplate(template);
                    setMode('edit');
                  }}
                  onDelete={() => deleteTemplate(template.id)}
                  onUse={() => handleUseTemplate(template)}
                />
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
