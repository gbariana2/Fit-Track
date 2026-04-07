'use client';

import { OverloadMode } from '@/lib/types';
import { OVERLOAD_MODE_CONFIG } from '@/lib/constants';

interface OverloadModeSelectorProps {
  value: OverloadMode;
  onChange: (mode: OverloadMode) => void;
}

const modes: OverloadMode[] = ['chill', 'manageable', 'aggressive'];

const modeIcons: Record<OverloadMode, string> = {
  chill: '🌿',
  manageable: '📈',
  aggressive: '🔥',
};

export default function OverloadModeSelector({ value, onChange }: OverloadModeSelectorProps) {
  const config = OVERLOAD_MODE_CONFIG[value];

  return (
    <div className={`rounded-xl border p-3 ${config.bg} transition-colors`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Growth Mode
          </span>
        </div>
      </div>
      <div className="flex gap-1 bg-white/60 dark:bg-black/20 rounded-lg p-1 mb-2">
        {modes.map((mode) => {
          const isActive = value === mode;
          const cfg = OVERLOAD_MODE_CONFIG[mode];
          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-white dark:bg-neutral-800 shadow-sm ' + cfg.color
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{modeIcons[mode]}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {config.description}
      </p>
    </div>
  );
}
