import { MuscleGroup } from '@/lib/types';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '@/lib/constants';

interface BadgeProps {
  muscleGroup: MuscleGroup;
  className?: string;
}

export default function Badge({ muscleGroup, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${MUSCLE_GROUP_COLORS[muscleGroup]} ${className}`}
    >
      {MUSCLE_GROUP_LABELS[muscleGroup]}
    </span>
  );
}
