import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface Exercise {
  id: string;
  exerciseName: string;
  muscleGroup: string;
  workoutId: string;
  sets: Set[];
}

interface Set {
  id: string;
  weight: number;
  reps: number;
  exerciseId: string;
}

interface CalendarCardStep2Props {
  onBack: () => void;
  exercises: Exercise[];
  isLoading: boolean;
}

export function CalendarCardStep2({ onBack, exercises, isLoading }: CalendarCardStep2Props) {
  const safeExercises = exercises || [];

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 border-slate-700">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <span className="text-slate-300">Loading exercises...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Workout Details</CardTitle>
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[60vh] overflow-y-auto">
            {safeExercises.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-slate-400">No exercises found for this workout.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {safeExercises.map((exercise) => (
                  <div key={exercise.id} className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-1">
                        {exercise.exerciseName}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Muscle Group: {exercise.muscleGroup}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {(exercise.sets || []).map((set, idx) => (
                        <div 
                          key={set.id} 
                          className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4"
                        >
                          <div className="text-slate-300 text-sm">
                            Set {idx + 1}
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <div className="text-lg font-medium text-white">
                                {set.weight || 0}
                              </div>
                              <div className="text-xs text-slate-400">
                                lbs
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-medium text-white">
                                {set.reps || 0}
                              </div>
                              <div className="text-xs text-slate-400">
                                reps
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-slate-700">
            <Button
              onClick={onBack}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarCardStep2;