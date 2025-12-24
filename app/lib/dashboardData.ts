// app/lib/dashboardData.ts
import prisma from "./db";

interface DashboardStats {
  workoutsThisWeek: number;
  workoutsLastWeek: number;
  totalSetsCompleted: number;
  setsChange: number;
  totalExercises: number;
  exercisesThisWeek: number;
  currentStreak: number;
  recentWorkouts: Array<{
    title: string;
    date: Date;
  }>;
  weeklyGoal: {
    current: number;
    target: number;
    duration: number;
    targetDuration: number;
  };
  muscleGroupFocus: Array<{
    name: string;
    count: number;
  }>;
}

interface ExerciseProgressData {
  date: string;
  maxWeight: number;
  totalVolume: number;
  avgReps: number;
}

interface MuscleDistribution {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsData {
  muscleGroups: string[];
  exercisesByMuscle: Record<string, string[]>;
  progressData: Record<string, ExerciseProgressData[]>;
  muscleDistribution: MuscleDistribution[];
}

const COLORS: Record<string, string> = {
  Chest: '#3b82f6',
  Shoulders: '#8b5cf6',
  Triceps: '#ec4899',
  Back: '#10b981',
  Biceps: '#f59e0b',
  Legs: '#ef4444'
};

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Get current date boundaries
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  // Fetch all user workouts with exercises and sets
  const allWorkouts = await prisma.workout.findMany({
    where: { userId },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  // Get workouts for this week
  const workoutsThisWeekData = allWorkouts.filter(
    (w) => w.date >= startOfWeek && w.date < endOfWeek
  );

  // Get workouts for last week
  const workoutsLastWeekData = allWorkouts.filter(
    (w) => w.date >= startOfLastWeek && w.date < startOfWeek
  );

  // Calculate total sets this week
  const totalSetsThisWeek = workoutsThisWeekData.reduce((total, workout) => {
    const workoutSets = workout.exercises.reduce((exTotal, exercise) => {
      return exTotal + exercise.sets.length;
    }, 0);
    return total + workoutSets;
  }, 0);

  // Calculate total sets last week
  const totalSetsLastWeek = workoutsLastWeekData.reduce((total, workout) => {
    const workoutSets = workout.exercises.reduce((exTotal, exercise) => {
      return exTotal + exercise.sets.length;
    }, 0);
    return total + workoutSets;
  }, 0);

  // Calculate percentage change for sets
  const setsChange = totalSetsLastWeek > 0
    ? Math.round(((totalSetsThisWeek - totalSetsLastWeek) / totalSetsLastWeek) * 100)
    : 0;

  // Calculate workouts this week and last week
  const workoutsThisWeek = workoutsThisWeekData.length;
  const workoutsLastWeek = workoutsLastWeekData.length;

  // Calculate total exercises
  const totalExercises = allWorkouts.reduce(
    (sum, workout) => sum + workout.exercises.length,
    0
  );

  // Calculate exercises this week
  const exercisesThisWeek = workoutsThisWeekData.reduce(
    (sum, workout) => sum + workout.exercises.length, 
    0
  );

  // Calculate streak
  const currentStreak = calculateStreak(allWorkouts);

  // Get recent workouts (last 5)
  const recentWorkouts = allWorkouts.slice(0, 5).map((w) => ({
    title: w.title,
    date: w.date,
  }));

  // Calculate weekly goal duration (estimate: 3 minutes per set + 5 minutes warmup per workout)
  const weeklyDuration = workoutsThisWeekData.reduce((sum, workout) => {
    const exerciseTime = workout.exercises.reduce(
      (eSum, exercise) => eSum + exercise.sets.length * 3,
      0
    );
    return sum + exerciseTime + 5;
  }, 0);

  // Calculate weekly goal
  const weeklyGoal = {
    current: workoutsThisWeek,
    target: 15,
    duration: weeklyDuration,
    targetDuration: 360, // 6 hours in minutes
  };

  // Calculate muscle group focus (this week)
  const muscleGroupCount: Record<string, number> = {};
  workoutsThisWeekData.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const group = exercise.muscleGroup;
      muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
    });
  });

  const muscleGroupFocus = Object.entries(muscleGroupCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    workoutsThisWeek,
    workoutsLastWeek,
    totalSetsCompleted: totalSetsThisWeek,
    setsChange,
    totalExercises,
    exercisesThisWeek,
    currentStreak,
    recentWorkouts,
    weeklyGoal,
    muscleGroupFocus,
  };
}

export async function getAnalyticsData(userId: string): Promise<AnalyticsData> {
  const now = new Date();
  
  // Get last 30 days for muscle distribution
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Get last 90 days for exercise progress
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);

  // Fetch all workouts with exercises and sets
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      date: { gte: ninetyDaysAgo }
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    },
    orderBy: { date: 'asc' }
  });

  // Get unique muscle groups
  const muscleGroupsSet = new Set<string>();
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      muscleGroupsSet.add(exercise.muscleGroup);
    });
  });
  const muscleGroups = Array.from(muscleGroupsSet).sort();

  // Get exercises grouped by muscle
  const exercisesByMuscle: Record<string, Set<string>> = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (!exercisesByMuscle[exercise.muscleGroup]) {
        exercisesByMuscle[exercise.muscleGroup] = new Set();
      }
      exercisesByMuscle[exercise.muscleGroup].add(exercise.exerciseName);
    });
  });

  // Convert Sets to Arrays
  const exercisesByMuscleArray: Record<string, string[]> = {};
  Object.entries(exercisesByMuscle).forEach(([muscle, exerciseSet]) => {
    exercisesByMuscleArray[muscle] = Array.from(exerciseSet).sort();
  });

  // Calculate progress data for each exercise
  const progressData: Record<string, ExerciseProgressData[]> = {};
  
  Object.values(exercisesByMuscle).forEach(exerciseSet => {
    Array.from(exerciseSet).forEach(exerciseName => {
      const exerciseWorkouts = workouts.filter(workout =>
        workout.exercises.some(ex => ex.exerciseName === exerciseName)
      );

      const progressPoints: ExerciseProgressData[] = exerciseWorkouts.map(workout => {
        const exercise = workout.exercises.find(ex => ex.exerciseName === exerciseName)!;
        
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
        const totalVolume = exercise.sets.reduce(
          (sum, set) => sum + (set.weight * set.reps),
          0
        );
        const avgReps = Math.round(
          exercise.sets.reduce((sum, set) => sum + set.reps, 0) / exercise.sets.length
        );

        return {
          date: workout.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          maxWeight,
          totalVolume,
          avgReps
        };
      });

      progressData[exerciseName] = progressPoints;
    });
  });

  // Calculate muscle distribution (last 30 days)
  const muscleCount: Record<string, number> = {};
  workouts
    .filter(w => w.date >= thirtyDaysAgo)
    .forEach(workout => {
      workout.exercises.forEach(exercise => {
        muscleCount[exercise.muscleGroup] = (muscleCount[exercise.muscleGroup] || 0) + 1;
      });
    });

  const muscleDistribution: MuscleDistribution[] = Object.entries(muscleCount)
    .map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || '#64748b'
    }))
    .sort((a, b) => b.value - a.value);

  return {
    muscleGroups,
    exercisesByMuscle: exercisesByMuscleArray,
    progressData,
    muscleDistribution
  };
}

function calculateStreak(workouts: Array<{ date: Date }>): number {
  if (workouts.length === 0) return 0;

  // Sort workouts by date descending
  const sortedDates = workouts
    .map((w) => new Date(w.date).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  // Remove duplicates (same day)
  const uniqueDates = [...new Set(sortedDates)];

  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000; // 24 hours in milliseconds

  // Check if most recent workout is today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  // Count consecutive days
  let expectedDate = uniqueDates[0];
  for (const date of uniqueDates) {
    if (date === expectedDate) {
      streak++;
      expectedDate -= 86400000; // Move to previous day
    } else {
      break;
    }
  }

  return streak;
}