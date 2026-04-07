'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkouts } from '@/hooks/useWorkouts';
import { calculateStreak, getWorkoutVolume, getWorkoutTotalSets, getWorkoutTotalReps, getUniqueExerciseNames } from '@/lib/utils';
import { getGreeting, suggestTodayTemplate, hasWorkedOutToday } from '@/lib/suggestions';
import { computeScoreHistory } from '@/lib/score';
import { computeAllPRs } from '@/lib/records';
import { generateSeedData } from '@/lib/seed';
import { WorkoutTemplate } from '@/lib/types';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Animate';
import NameSetup from '@/components/dashboard/NameSetup';
import TodaysPlan from '@/components/dashboard/TodaysPlan';
import WeekOverview from '@/components/dashboard/WeekOverview';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function HomePage() {
  const router = useRouter();
  const { workouts, templates, settings, isLoaded, updateSettings, loadFullState } = useWorkouts();

  const streak = useMemo(() => calculateStreak(workouts), [workouts]);
  const suggestedTemplate = useMemo(
    () => suggestTodayTemplate(workouts, templates),
    [workouts, templates]
  );
  const workedOutToday = useMemo(() => hasWorkedOutToday(workouts), [workouts]);

  const stats = useMemo(() => {
    if (workouts.length === 0) return null;
    const totalVolume = workouts.reduce((sum, w) => sum + getWorkoutVolume(w), 0);
    const totalSets = workouts.reduce((sum, w) => sum + getWorkoutTotalSets(w), 0);
    const scores = computeScoreHistory(workouts);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0;
    const prs = computeAllPRs(workouts);

    const muscleCount: Record<string, number> = {};
    for (const w of workouts) {
      for (const ex of w.exercises) {
        muscleCount[ex.muscleGroup] = (muscleCount[ex.muscleGroup] || 0) + 1;
      }
    }
    const topMuscles = Object.entries(muscleCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const exerciseFreq: Record<string, number> = {};
    for (const w of workouts) {
      for (const ex of w.exercises) {
        exerciseFreq[ex.name] = (exerciseFreq[ex.name] || 0) + 1;
      }
    }
    const topExercises = Object.entries(exerciseFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { totalVolume, totalSets, avgScore, prs, topMuscles, topExercises };
  }, [workouts]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleStartWorkout = (template: WorkoutTemplate) => {
    sessionStorage.setItem('workout-tracker-load-template', template.id);
    router.push('/log');
  };

  const formatVolume = (v: number) =>
    v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString();

  if (!isLoaded) {
    return (
      <div className="space-y-6 pt-4">
        <div className="shimmer h-28 rounded-2xl" />
        <div className="shimmer h-48 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!settings.userName) {
    return (
      <NameSetup
        onSave={(name) => updateSettings({ userName: name })}
        onLoadDemo={() => loadFullState(generateSeedData())}
      />
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Hero greeting */}
        <div className="pt-2 pb-2">
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-1">{today}</p>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            {getGreeting()},{' '}
            <span className="text-gradient">{settings.userName}</span>
          </h1>
          {streak.current > 0 ? (
            <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
              You're on a <span className="font-bold text-zinc-700 dark:text-zinc-300">{streak.current}-day streak</span>
              {streak.current >= 3 ? ' — keep the momentum going!' : '.'}
            </p>
          ) : (
            <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
              Ready to start your next workout?
            </p>
          )}
        </div>

        {/* Today's plan */}
        <ScrollReveal>
          <TodaysPlan
            template={suggestedTemplate}
            hasWorkedOut={workedOutToday}
            onStartWorkout={handleStartWorkout}
          />
        </ScrollReveal>

        {/* Week at a glance */}
        <ScrollReveal delay={0.05}>
          <WeekOverview workouts={workouts} />
        </ScrollReveal>

        {/* Key stats — only show if there's data */}
        {stats && (
          <>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Workouts', value: workouts.length, icon: '🏋️' },
                { label: 'Volume', value: formatVolume(stats.totalVolume), suffix: 'lbs', icon: '💪' },
                { label: 'Avg Score', value: stats.avgScore, icon: '⚡' },
                { label: 'Best Streak', value: `${streak.longest}d`, icon: '🔥' },
              ].map((stat) => (
                <StaggerItem key={stat.label}>
                  <HoverLift>
                    <Card variant="elevated" className="text-center">
                      <span className="text-lg block mb-1">{stat.icon}</span>
                      <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {stat.value}
                        {stat.suffix && <span className="text-xs font-medium text-zinc-400 ml-0.5">{stat.suffix}</span>}
                      </p>
                      <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Muscle balance + top exercises */}
            <div className="grid sm:grid-cols-2 gap-4">
              <ScrollReveal>
                <Card variant="elevated" className="h-full">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                    Muscle Balance
                  </h3>
                  <div className="space-y-2.5">
                    {stats.topMuscles.map(([group, count]) => {
                      const max = stats.topMuscles[0][1] as number;
                      const pct = Math.round(((count as number) / max) * 100);
                      return (
                        <div key={group}>
                          <div className="flex items-center justify-between mb-1">
                            <Badge muscleGroup={group as any} />
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                              {count as number}x
                            </span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <Card variant="elevated" className="h-full">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                    Top Exercises
                  </h3>
                  <div className="space-y-1.5">
                    {stats.topExercises.map(([name, count], i) => (
                      <div key={name} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 text-right">{i + 1}.</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{name}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{count as number}x</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            </div>

            {/* PR highlights */}
            <ScrollReveal>
              <Card variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Personal Records
                  </h3>
                  <Link href="/records" className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors">
                    View All →
                  </Link>
                </div>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.prs.slice(0, 6).map((pr) => (
                    <StaggerItem key={pr.exerciseName}>
                      <HoverLift>
                        <div className="p-3 rounded-xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-100/50 dark:border-zinc-700/30">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{pr.exerciseName}</p>
                          <p className="text-lg font-black text-gradient mt-0.5">
                            {pr.maxWeight.value} <span className="text-xs font-medium text-zinc-400">{pr.maxWeight.unit}</span>
                          </p>
                          {pr.estimated1RM.value > 0 && (
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              Est. 1RM: {pr.estimated1RM.value} lbs
                            </p>
                          )}
                        </div>
                      </HoverLift>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Card>
            </ScrollReveal>
          </>
        )}

        {/* Recent activity */}
        <ScrollReveal>
          <RecentWorkouts workouts={workouts} />
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
