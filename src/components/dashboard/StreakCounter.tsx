'use client';

import Card from '@/components/ui/Card';

interface StreakCounterProps {
  current: number;
  longest: number;
}

export default function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <Card variant="elevated">
      <div className="flex items-center gap-6">
        {/* Current streak */}
        <div className="flex-1">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Current Streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {current}
            </span>
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {current === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-14 bg-zinc-200 dark:bg-zinc-700" />

        {/* Longest streak */}
        <div className="flex-1">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Best Streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-gradient tracking-tight">
              {longest}
            </span>
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {longest === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
