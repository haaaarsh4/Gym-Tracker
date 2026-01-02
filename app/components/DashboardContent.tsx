// app/components/DashboardContent.tsx
"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { WorkoutAnalytics } from "./WorkoutAnalytics";

const ModelViewer = dynamic(() => import("@/app/components/modelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  ),
});

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
  [key: string]: string | number;
}

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
  analytics: {
    muscleGroups: string[];
    exercisesByMuscle: Record<string, string[]>;
    progressData: Record<string, ExerciseProgressData[]>;
    muscleDistribution: MuscleDistribution[];
  };
}

interface DashboardContentProps {
  stats: DashboardStats;
}

export default function DashboardContent({ stats }: DashboardContentProps) {
  const handleLogWorkout = () => {
    redirect("/dashboard/addWorkout");
  };

  const handleWorkoutHistory = () => {
    redirect("/dashboard/calendar");
  };

  const handleWorkoutGallery = () => {
    redirect("/dashboard/gallary");
  };

  // Calculate percentage change
  const workoutPercentChange = stats.workoutsLastWeek > 0 
    ? Math.round(((stats.workoutsThisWeek - stats.workoutsLastWeek) / stats.workoutsLastWeek) * 100)
    : 0;

  // Calculate goal percentages
  const workoutGoalPercent = Math.min((stats.weeklyGoal.current / stats.weeklyGoal.target) * 100, 100);
  const durationGoalPercent = Math.min((stats.weeklyGoal.duration / stats.weeklyGoal.targetDuration) * 100, 100);

  // Format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return diffHours === 0 ? "Just now" : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950">
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="text-center pt-4 pb-4 sm:pt-6 sm:pb-8 px-4 flex-shrink-0 relative z-50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Workout <span className="text-blue-500">Tracker</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Visualize your muscle groups and track your fitness journey with precision
          </p>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Workouts This Week */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.workoutsThisWeek}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Workouts This Week</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  {workoutPercentChange !== 0 && (
                    <>
                      <span className={`font-medium ${workoutPercentChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {workoutPercentChange > 0 ? '+' : ''}{workoutPercentChange}%
                      </span>
                      <span className="text-slate-500 dark:text-slate-500">vs last week</span>
                    </>
                  )}
                  {workoutPercentChange === 0 && (
                    <span className="text-slate-500 dark:text-slate-500">No change</span>
                  )}
                </div>
              </div>

              {/* Total Sets Completed */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalSetsCompleted || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Sets This Week</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  {stats.setsChange !== undefined && stats.setsChange !== 0 ? (
                    <>
                      <span className={`font-medium ${stats.setsChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.setsChange > 0 ? '+' : ''}{stats.setsChange}%
                      </span>
                      <span className="text-slate-500 dark:text-slate-500">vs last week</span>
                    </>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-500">
                      {stats.totalSetsCompleted > 0 ? 'Great start!' : 'Start tracking!'}
                    </span>
                  )}
                </div>
              </div>

              {/* Total Exercises */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalExercises}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Total Exercises</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <span className="text-green-600 dark:text-green-400 font-medium">+{stats.exercisesThisWeek}</span>
                  <span className="text-slate-500 dark:text-slate-500">this week</span>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.currentStreak}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Day Streak</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  {stats.currentStreak > 0 && (
                    <>
                      <span className="text-green-600 dark:text-green-400 font-medium">🔥</span>
                      <span className="text-slate-500 dark:text-slate-500">Keep it up!</span>
                    </>
                  )}
                  {stats.currentStreak === 0 && (
                    <span className="text-slate-500 dark:text-slate-500">Start your streak!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Quick Actions */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 text-sm"
                      onClick={handleLogWorkout}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Log Workout
                    </button>
                    <button
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      onClick={handleWorkoutHistory}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      History
                    </button>
                    <button
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      onClick={handleWorkoutGallery}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Gallery
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {stats.recentWorkouts.length > 0 ? (
                      stats.recentWorkouts.slice(0, 3).map((workout, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${
                            index === 0 ? 'bg-blue-500/10 dark:bg-blue-500/20' :
                            index === 1 ? 'bg-purple-500/10 dark:bg-purple-500/20' :
                            'bg-green-500/10 dark:bg-green-500/20'
                          } rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <svg className={`w-4 h-4 ${
                              index === 0 ? 'text-blue-600 dark:text-blue-400' :
                              index === 1 ? 'text-purple-600 dark:text-purple-400' :
                              'text-green-600 dark:text-green-400'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {workout.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                              {getTimeAgo(workout.date)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-500 text-center py-4">
                        No recent workouts
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Center - 3D Model */}
              <div className="lg:col-span-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm h-[500px] lg:h-[600px]">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                    <ModelViewer />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Goals & Progress */}
              <div className="lg:col-span-3 space-y-4">
                {/* Weekly Goal */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Weekly Goal</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Workouts</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {stats.weeklyGoal.current}/{stats.weeklyGoal.target}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${workoutGoalPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {(stats.weeklyGoal.duration / 60).toFixed(1)}/{(stats.weeklyGoal.targetDuration / 60).toFixed(0)}h
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${durationGoalPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Muscle Groups Trained */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">This Week's Focus</h3>
                  <div className="space-y-2">
                    {stats.muscleGroupFocus.length > 0 ? (
                      stats.muscleGroupFocus.slice(0, 4).map((group, index) => (
                        <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {group.name}
                          </span>
                          <span className={`text-xs font-bold ${
                            index === 0 ? 'text-blue-600 dark:text-blue-400' :
                            index === 1 ? 'text-purple-600 dark:text-purple-400' :
                            index === 2 ? 'text-green-600 dark:text-green-400' :
                            'text-orange-600 dark:text-orange-400'
                          }`}>
                            {group.count}x
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-500 text-center py-4">
                        No data yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Achievement */}
                {stats.currentStreak >= 3 && (
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1">
                          {stats.currentStreak} Day Streak!
                        </h3>
                        <p className="text-xs text-white/80 leading-relaxed">
                          You're on fire! Keep up the momentum.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <WorkoutAnalytics 
          muscleGroups={stats.analytics.muscleGroups}
          exercisesByMuscle={stats.analytics.exercisesByMuscle}
          progressData={stats.analytics.progressData}
          muscleDistribution={stats.analytics.muscleDistribution}
        />
      </div>
    </div>
  );
}