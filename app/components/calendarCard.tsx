import { useEffect, useState } from "react";
import { CalendarCardStep1 } from "./calendarCardStep1";
import { CalendarCardStep2 } from "./calendarCardStep2";

interface CalendarCardProps {
    workoutId: string;
    title: string;
    date: string;
    notes: string;
    onDelete: () => void;  // Add this prop
  }
    
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

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
  
export function CalendarCard({ workoutId, title, date, notes, onDelete }: CalendarCardProps) {
    const [step, setStep] = useState(1);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchExercises = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/getExercises?workoutId=${workoutId}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data: Exercise[] = await response.json();
          setExercises(data);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch exercises');
          console.error("Error fetching exercises:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (workoutId) {
        fetchExercises();
      }
    }, [workoutId]);
  
    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }
  
    return (
      <>
        {step === 1 ? (
            <CalendarCardStep1
                title={title}
                date={formatDateTime(date)}
                notes={notes}
                workoutId={workoutId}  // Pass workoutId
                onNext={handleNext}
                onDelete={onDelete}    // Pass onDelete
            />
            ) : (
            <CalendarCardStep2
                onBack={handleBack}
                exercises={exercises}
                isLoading={isLoading}
            />
            )}
      </>
    );
}  