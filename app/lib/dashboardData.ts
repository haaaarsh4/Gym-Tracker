// app/lib/dashboardData.ts
import prisma from "./db";

interface DashboardStats {
  workoutsThisWeek: number;
  workoutsLastWeek: number;
  averageDuration: number;
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

  // Fetch all user workouts with exercises
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

  // Calculate workouts this week
  const workoutsThisWeek = allWorkouts.filter(
    (w) => w.date >= startOfWeek && w.date < endOfWeek
  ).length;

  // Calculate workouts last week
  const workoutsLastWeek = allWorkouts.filter(
    (w) => w.date >= startOfLastWeek && w.date < startOfWeek
  ).length;

  // Calculate total exercises
  const totalExercises = allWorkouts.reduce(
    (sum, workout) => sum + workout.exercises.length,
    0
  );

  // Calculate exercises this week
  const exercisesThisWeek = allWorkouts
    .filter((w) => w.date >= startOfWeek && w.date < endOfWeek)
    .reduce((sum, workout) => sum + workout.exercises.length, 0);

  // Calculate average duration (estimate: 3 minutes per exercise + 5 minutes warmup)
  const averageDuration = allWorkouts.length > 0
    ? Math.round(
        allWorkouts.reduce((sum, workout) => {
          const exerciseTime = workout.exercises.reduce(
            (eSum, exercise) => eSum + exercise.sets.length * 3,
            0
          );
          return sum + exerciseTime + 5;
        }, 0) / allWorkouts.length
      )
    : 0;

  // Calculate streak
  const currentStreak = calculateStreak(allWorkouts);

  // Get recent workouts (last 5)
  const recentWorkouts = allWorkouts.slice(0, 5).map((w) => ({
    title: w.title,
    date: w.date,
  }));

  // Calculate weekly goal
  const weeklyGoal = {
    current: workoutsThisWeek,
    target: 15, // You can make this dynamic by adding a goal field to User model
    duration: allWorkouts
      .filter((w) => w.date >= startOfWeek && w.date < endOfWeek)
      .reduce((sum, workout) => {
        const exerciseTime = workout.exercises.reduce(
          (eSum, exercise) => eSum + exercise.sets.length * 3,
          0
        );
        return sum + exerciseTime + 5;
      }, 0),
    targetDuration: 360, // 6 hours in minutes
  };

  // Calculate muscle group focus (this week)
  const muscleGroupCount: Record<string, number> = {};
  allWorkouts
    .filter((w) => w.date >= startOfWeek && w.date < endOfWeek)
    .forEach((workout) => {
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
    averageDuration,
    totalExercises,
    exercisesThisWeek,
    currentStreak,
    recentWorkouts,
    weeklyGoal,
    muscleGroupFocus,
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