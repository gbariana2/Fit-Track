'use client';

import { TimeRange } from '@/lib/types';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const ranges: TimeRange[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-neutral-900 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === range
              ? 'bg-white dark:bg-neutral-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
