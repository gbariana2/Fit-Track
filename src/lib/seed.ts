import { WorkoutState } from './types';

function uuid() {
  return crypto.randomUUID();
}

/**
 * Realistic yearly progression:
 * - Beginners gain ~5 lbs/month on upper, ~10 lbs/month on lower
 * - Progress slows after ~3 months
 * - Deload weeks every 4-6 weeks (lighter weight)
 * - Reps fluctuate naturally
 */
function yearlyWeight(base: number, weekNum: number, isLower: boolean): number {
  const monthlyGain = isLower ? 10 : 5;
  // Diminishing returns: fast early, slow later
  const months = weekNum / 4.33;
  const gain = monthlyGain * Math.sqrt(months) * 0.8;
  // Deload weeks: every 5th week, drop 15%
  const isDeload = weekNum % 5 === 4;
  const weight = base + Math.round(gain / 5) * 5;
  return isDeload ? Math.round(weight * 0.85 / 5) * 5 : weight;
}

function makeSets(baseWeight: number, baseReps: number, weekNum: number, numSets: number, isLower = false) {
  const weight = yearlyWeight(baseWeight, weekNum, isLower);
  const isDeload = weekNum % 5 === 4;
  const repBoost = isDeload ? 2 : 0; // more reps on deload
  return Array.from({ length: numSets }, (_, i) => {
    const fatigue = i >= numSets - 1 ? Math.floor(Math.random() * 2) : 0;
    return {
      id: uuid(),
      weight,
      reps: Math.max(baseReps + repBoost - fatigue, baseReps - 1),
      unit: 'lbs' as const,
    };
  });
}

function makePyramid(baseWeights: number[], reps: number[], weekNum: number, isLower = false) {
  return baseWeights.map((w, i) => ({
    id: uuid(),
    weight: yearlyWeight(w, weekNum, isLower),
    reps: reps[i],
    unit: 'lbs' as const,
  }));
}

function makeBodyweight(reps: number, numSets: number) {
  return Array.from({ length: numSets }, () => ({
    id: uuid(), weight: 0, reps, unit: 'lbs' as const,
  }));
}

export function generateSeedData(): WorkoutState {
  const workouts: WorkoutState['workouts'] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365); // 1 year back

  for (let week = 0; week < 52; week++) {
    const mon = new Date(startDate); mon.setDate(startDate.getDate() + week * 7);
    const tue = new Date(mon); tue.setDate(mon.getDate() + 1);
    const wed = new Date(mon); wed.setDate(mon.getDate() + 2);
    const thu = new Date(mon); thu.setDate(mon.getDate() + 3);
    const fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    const sat = new Date(mon); sat.setDate(mon.getDate() + 5);
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    // Simulate ~2 missed weeks per quarter (skip some weeks)
    const skipWeek = [7, 15, 24, 33, 41, 49].includes(week);
    if (skipWeek) continue;

    // === MONDAY: Push A (heavy compounds) ===
    workouts.push({
      id: uuid(), date: fmt(mon), createdAt: mon.toISOString(),
      exercises: [
        { id: uuid(), name: 'Bench Press', muscleGroup: 'chest',
          sets: makePyramid([95, 115, 135, 135, 115], [12, 10, 8, 8, 10], week) },
        { id: uuid(), name: 'Incline Bench Press', muscleGroup: 'chest', sets: makeSets(95, 10, week, 4) },
        { id: uuid(), name: 'Overhead Press', muscleGroup: 'shoulders', sets: makeSets(65, 8, week, 4) },
        { id: uuid(), name: 'Lateral Raise', muscleGroup: 'shoulders', sets: makeSets(15, 12, week, 3) },
        { id: uuid(), name: 'Tricep Pushdown', muscleGroup: 'triceps', sets: makeSets(40, 12, week, 3) },
        { id: uuid(), name: 'Overhead Tricep Extension', muscleGroup: 'triceps', sets: makeSets(30, 12, week, 3) },
        ...(week >= 12 ? [{ id: uuid(), name: 'Chest Dip', muscleGroup: 'chest' as const, sets: makeBodyweight(8 + Math.min(Math.floor(week / 6), 8), 3) }] : []),
      ],
    });

    // === TUESDAY: Pull A (heavy) ===
    workouts.push({
      id: uuid(), date: fmt(tue), createdAt: tue.toISOString(),
      exercises: [
        { id: uuid(), name: 'Deadlift', muscleGroup: 'back',
          sets: makePyramid([135, 185, 225, 225], [8, 6, 4, 4], week, true) },
        { id: uuid(), name: 'Barbell Row', muscleGroup: 'back', sets: makeSets(115, 8, week, 4) },
        { id: uuid(), name: 'Lat Pulldown', muscleGroup: 'back', sets: makeSets(100, 10, week, 4) },
        { id: uuid(), name: 'Face Pull', muscleGroup: 'shoulders', sets: makeSets(25, 15, week, 3) },
        { id: uuid(), name: 'Barbell Curl', muscleGroup: 'biceps', sets: makeSets(50, 10, week, 4) },
        { id: uuid(), name: 'Hammer Curl', muscleGroup: 'biceps', sets: makeSets(25, 10, week, 3) },
        ...(week >= 16 ? [{ id: uuid(), name: 'Pull-Up', muscleGroup: 'back' as const, sets: makeBodyweight(5 + Math.min(Math.floor(week / 8), 7), 3) }] : []),
      ],
    });

    // === WEDNESDAY: Legs A (quad focus) ===
    workouts.push({
      id: uuid(), date: fmt(wed), createdAt: wed.toISOString(),
      exercises: [
        { id: uuid(), name: 'Squat', muscleGroup: 'legs',
          sets: makePyramid([135, 155, 185, 185, 155], [10, 8, 6, 6, 8], week, true) },
        { id: uuid(), name: 'Leg Press', muscleGroup: 'legs', sets: makeSets(230, 10, week, 4, true) },
        { id: uuid(), name: 'Leg Extension', muscleGroup: 'legs', sets: makeSets(80, 12, week, 3, true) },
        { id: uuid(), name: 'Leg Curl', muscleGroup: 'legs', sets: makeSets(70, 12, week, 3, true) },
        { id: uuid(), name: 'Calf Raise', muscleGroup: 'legs', sets: makeSets(115, 15, week, 4, true) },
        { id: uuid(), name: 'Plank', muscleGroup: 'core', sets: makeBodyweight(45 + Math.min(week, 45), 3), notes: 'seconds' },
        { id: uuid(), name: 'Hanging Leg Raise', muscleGroup: 'core', sets: makeBodyweight(8 + Math.min(Math.floor(week / 4), 10), 3) },
      ],
    });

    // === THURSDAY: Push B (volume) ===
    workouts.push({
      id: uuid(), date: fmt(thu), createdAt: thu.toISOString(),
      exercises: [
        { id: uuid(), name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', sets: makeSets(35, 10, week, 4) },
        { id: uuid(), name: 'Dumbbell Fly', muscleGroup: 'chest', sets: makeSets(25, 12, week, 4) },
        { id: uuid(), name: 'Cable Crossover', muscleGroup: 'chest', sets: makeSets(20, 12, week, 3) },
        { id: uuid(), name: 'Arnold Press', muscleGroup: 'shoulders', sets: makeSets(30, 10, week, 3) },
        { id: uuid(), name: 'Front Raise', muscleGroup: 'shoulders', sets: makeSets(15, 12, week, 3) },
        { id: uuid(), name: 'Skull Crusher', muscleGroup: 'triceps', sets: makeSets(45, 10, week, 3) },
        { id: uuid(), name: 'Push-Up', muscleGroup: 'chest', sets: makeBodyweight(15 + Math.min(Math.floor(week / 3), 20), 3) },
      ],
    });

    // === FRIDAY: Pull B (volume) ===
    workouts.push({
      id: uuid(), date: fmt(fri), createdAt: fri.toISOString(),
      exercises: [
        { id: uuid(), name: 'Seated Cable Row', muscleGroup: 'back', sets: makeSets(90, 10, week, 4) },
        { id: uuid(), name: 'Dumbbell Row', muscleGroup: 'back', sets: makeSets(50, 10, week, 4) },
        { id: uuid(), name: 'T-Bar Row', muscleGroup: 'back', sets: makeSets(70, 10, week, 3) },
        { id: uuid(), name: 'Reverse Fly', muscleGroup: 'shoulders', sets: makeSets(12, 12, week, 3) },
        { id: uuid(), name: 'Dumbbell Curl', muscleGroup: 'biceps', sets: makeSets(20, 12, week, 3) },
        { id: uuid(), name: 'Preacher Curl', muscleGroup: 'biceps', sets: makeSets(40, 10, week, 3) },
        { id: uuid(), name: 'Cable Curl', muscleGroup: 'biceps', sets: makeSets(25, 12, week, 3) },
      ],
    });

    // === SATURDAY: Legs B (posterior + cardio) ===
    // Skip Saturdays roughly every 3rd week
    if (week % 3 !== 2) {
      workouts.push({
        id: uuid(), date: fmt(sat), createdAt: sat.toISOString(),
        exercises: [
          { id: uuid(), name: 'Romanian Deadlift', muscleGroup: 'legs', sets: makeSets(135, 8, week, 4, true) },
          { id: uuid(), name: 'Bulgarian Split Squat', muscleGroup: 'legs', sets: makeSets(35, 10, week, 3, true) },
          { id: uuid(), name: 'Hip Thrust', muscleGroup: 'legs', sets: makeSets(115, 10, week, 4, true) },
          { id: uuid(), name: 'Lunges', muscleGroup: 'legs', sets: makeSets(30, 10, week, 3, true) },
          { id: uuid(), name: 'Calf Raise', muscleGroup: 'legs', sets: makeSets(115, 15, week, 4, true) },
          { id: uuid(), name: 'Running', muscleGroup: 'cardio',
            sets: [{ id: uuid(), weight: 0, reps: 20 + Math.min(Math.floor(week / 4) * 2, 20), unit: 'lbs' as const }],
            notes: `${2 + Math.floor(Math.min(week, 40) * 0.08)} miles` },
          { id: uuid(), name: 'Russian Twist', muscleGroup: 'core', sets: makeSets(20, 15, week, 3) },
          { id: uuid(), name: 'Cable Woodchop', muscleGroup: 'core', sets: makeSets(25, 12, week, 3) },
          ...(week >= 12 ? [{ id: uuid(), name: 'Ab Wheel Rollout', muscleGroup: 'core' as const, sets: makeBodyweight(6 + Math.min(Math.floor(week / 6), 10), 3) }] : []),
        ],
      });
    }
  }

  const templates: WorkoutState['templates'] = [
    {
      id: uuid(), name: 'Push A — Heavy', description: 'Heavy bench, OHP, and triceps',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Bench Press', muscleGroup: 'chest', defaultSets: 5, defaultReps: 8 },
        { id: uuid(), name: 'Incline Bench Press', muscleGroup: 'chest', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Overhead Press', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: 8 },
        { id: uuid(), name: 'Lateral Raise', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Tricep Pushdown', muscleGroup: 'triceps', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Overhead Tricep Extension', muscleGroup: 'triceps', defaultSets: 3, defaultReps: 12 },
      ],
    },
    {
      id: uuid(), name: 'Push B — Volume', description: 'Hypertrophy chest, shoulders, and triceps',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Dumbbell Fly', muscleGroup: 'chest', defaultSets: 4, defaultReps: 12 },
        { id: uuid(), name: 'Cable Crossover', muscleGroup: 'chest', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Arnold Press', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 10 },
        { id: uuid(), name: 'Skull Crusher', muscleGroup: 'triceps', defaultSets: 3, defaultReps: 10 },
      ],
    },
    {
      id: uuid(), name: 'Pull A — Heavy', description: 'Deadlift, rows, and biceps',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Deadlift', muscleGroup: 'back', defaultSets: 4, defaultReps: 5 },
        { id: uuid(), name: 'Barbell Row', muscleGroup: 'back', defaultSets: 4, defaultReps: 8 },
        { id: uuid(), name: 'Lat Pulldown', muscleGroup: 'back', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Face Pull', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 15 },
        { id: uuid(), name: 'Barbell Curl', muscleGroup: 'biceps', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Hammer Curl', muscleGroup: 'biceps', defaultSets: 3, defaultReps: 10 },
      ],
    },
    {
      id: uuid(), name: 'Pull B — Volume', description: 'Back and bicep hypertrophy',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Seated Cable Row', muscleGroup: 'back', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Dumbbell Row', muscleGroup: 'back', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'T-Bar Row', muscleGroup: 'back', defaultSets: 3, defaultReps: 10 },
        { id: uuid(), name: 'Dumbbell Curl', muscleGroup: 'biceps', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Preacher Curl', muscleGroup: 'biceps', defaultSets: 3, defaultReps: 10 },
      ],
    },
    {
      id: uuid(), name: 'Legs A — Quads', description: 'Squat-focused quad day',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Squat', muscleGroup: 'legs', defaultSets: 5, defaultReps: 8 },
        { id: uuid(), name: 'Leg Press', muscleGroup: 'legs', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Leg Extension', muscleGroup: 'legs', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Leg Curl', muscleGroup: 'legs', defaultSets: 3, defaultReps: 12 },
        { id: uuid(), name: 'Calf Raise', muscleGroup: 'legs', defaultSets: 4, defaultReps: 15 },
      ],
    },
    {
      id: uuid(), name: 'Legs B — Posterior', description: 'Hamstrings, glutes, and cardio',
      createdAt: new Date(startDate).toISOString(),
      exercises: [
        { id: uuid(), name: 'Romanian Deadlift', muscleGroup: 'legs', defaultSets: 4, defaultReps: 8 },
        { id: uuid(), name: 'Bulgarian Split Squat', muscleGroup: 'legs', defaultSets: 3, defaultReps: 10 },
        { id: uuid(), name: 'Hip Thrust', muscleGroup: 'legs', defaultSets: 4, defaultReps: 10 },
        { id: uuid(), name: 'Lunges', muscleGroup: 'legs', defaultSets: 3, defaultReps: 10 },
        { id: uuid(), name: 'Running', muscleGroup: 'cardio', defaultSets: 1, defaultReps: 30 },
      ],
    },
  ];

  return {
    workouts,
    templates,
    settings: {
      defaultUnit: 'lbs',
      theme: 'light',
      overloadMode: 'manageable',
      userName: 'Gurshaan',
    },
  };
}
