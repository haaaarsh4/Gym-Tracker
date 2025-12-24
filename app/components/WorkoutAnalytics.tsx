import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface AnalyticsProps {
  muscleGroups: string[];
  exercisesByMuscle: Record<string, string[]>;
  progressData: Record<string, ExerciseProgressData[]>;
  muscleDistribution: MuscleDistribution[];
}

export function WorkoutAnalytics({ 
  muscleGroups, 
  exercisesByMuscle, 
  progressData,
  muscleDistribution 
}: AnalyticsProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<string>(muscleGroups[0] || "");
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  const availableExercises = selectedMuscle ? exercisesByMuscle[selectedMuscle] || [] : [];
  const chartData = selectedExercise ? progressData[selectedExercise] || [] : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics & Progress
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your strength gains and training patterns
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Exercise Progress Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                Exercise Progress
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select an exercise to view your progression over the last 90 days
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Muscle Group
                </label>
                <Select value={selectedMuscle} onValueChange={(value) => {
                  setSelectedMuscle(value);
                  setSelectedExercise("");
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select muscle" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {muscle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Exercise
                </label>
                <Select 
                  value={selectedExercise} 
                  onValueChange={setSelectedExercise}
                  disabled={!selectedMuscle}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedMuscle ? "Select exercise" : "Select muscle first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExercises.map((exercise) => (
                      <SelectItem key={exercise} value={exercise}>
                        {exercise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-6">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      style={{ fontSize: '11px' }}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      style={{ fontSize: '11px' }}
                      width={40}
                      label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft', style: { fontSize: '11px', fill: '#94a3b8' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maxWeight" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Weight (lbs)"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm font-medium">
                    {selectedExercise ? "No data available" : "Select an exercise to view progress"}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Peak Weight</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.max(...chartData.map(d => d.maxWeight))}
                    <span className="text-xs font-normal ml-1">lbs</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Reps</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(chartData.reduce((sum, d) => sum + d.avgReps, 0) / chartData.length)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sessions</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {chartData.length}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Muscle Group Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                Training Split
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your muscle group distribution over the last 30 days
              </p>
            </div>

            {muscleDistribution.length > 0 ? (
              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={muscleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {muscleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {muscleDistribution.map((muscle) => {
                    const percentage = ((muscle.value / muscleDistribution.reduce((sum, m) => sum + m.value, 0)) * 100).toFixed(0);
                    return (
                      <div key={muscle.name} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: muscle.color }}
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {muscle.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {muscle.value} exercise{muscle.value !== 1 ? 's' : ''}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white min-w-[40px] text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-sm font-medium">No workout data available</p>
                <p className="text-xs mt-1">Start logging workouts to see your split</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}