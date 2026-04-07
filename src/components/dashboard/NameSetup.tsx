'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface NameSetupProps {
  onSave: (name: string) => void;
  onLoadDemo: () => void;
}

export default function NameSetup({ onSave, onLoadDemo }: NameSetupProps) {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      {/* Logo */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-sky-500/20 mb-8">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
        Welcome to <span className="text-gradient">FitTrack</span>
      </h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-md">
        Your workouts, your progress, your personal records — all in one place.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave(name.trim())}
          placeholder="What should we call you?"
          autoFocus
          className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-center text-lg font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
        />
        <Button
          size="lg"
          className="w-full text-base py-4"
          onClick={() => name.trim() && onSave(name.trim())}
          disabled={!name.trim()}
        >
          Get Started
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--background)] px-3 text-xs font-medium text-zinc-400 dark:text-zinc-500">or</span>
          </div>
        </div>

        <button
          onClick={onLoadDemo}
          className="w-full px-5 py-3.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-white/60 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-800 rounded-2xl transition-all border border-zinc-200 dark:border-zinc-700"
        >
          Load Demo Data
          <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 ml-2">
            10 weeks of PPL workouts
          </span>
        </button>
      </div>
    </div>
  );
}
