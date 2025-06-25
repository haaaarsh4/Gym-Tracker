"use client";

import { EditWorkoutStep1 } from "@/app/components/editWorkout1";
import { EditWorkoutStep2 } from "@/app/components/editWorkout2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WorkoutData {
  id: string;
  title: string;
  date: string;
  notes: string;
  exercises?: {
    id: string;
    exerciseName: string;
    muscleGroup: string;
    sets: {
      id: string;
      weight: number;
      reps: number;
    }[];
  }[];
}

export default function EditWorkout() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      setIsLoading(true);
      const path = window.location.pathname;
      const id = path.split("/").pop();
      setWorkoutId(id || null);

      if (id) {
        try {
          const response = await fetch(`/api/editWorkout?id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch workout data");
          }
          const data = await response.json();
          setWorkoutData(data);
        } catch (error) {
          console.error("Error fetching workout data:", error);
          toast.error("Failed to load workout data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWorkout();
  }, []);

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div>Loading workout data...</div>
        </Card>
      </div>
    );
  }

  if (!workoutData || !workoutId) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div>Workout not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
          <CardDescription>Update your workout details below</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <EditWorkoutStep1
              onNext={handleNext}
              title={workoutData.title}
              date={workoutData.date}
              notes={workoutData.notes}
              workoutId={workoutId}
            />
          )}

          {step === 2 && (
            <EditWorkoutStep2
              workoutId={workoutId}
              onBack={handleBack}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}