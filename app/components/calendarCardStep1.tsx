import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface iAppProps {
  title: string;
  date: string;
  notes: string;
  workoutId: string;
  onNext: () => void;
  onDelete: () => void;
}

export function CalendarCardStep1({ 
  title, 
  date, 
  notes, 
  workoutId, 
  onNext, 
  onDelete 
}: iAppProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/deleteWorkout?workoutId=${workoutId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete workout');
      onDelete();
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    window.location.href = `/dashboard/editWorkout/${workoutId}`;
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="flex items-center">
        <button
          onClick={handleEdit}
          className="mr-4 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md p-1 cursor-pointer"
          aria-label="Edit workout"
          title="Edit"
        >
          <Pencil className="h-4 w-4 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white" />
        </button>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Workout Summary</h2>
      </div>

      <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-zinc-400">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase text-slate-500 dark:text-zinc-500">Title</Label>
            <p className="text-base text-slate-900 dark:text-white font-medium">{title}</p>
          </div>
          <div>
            <Label className="text-xs uppercase text-slate-500 dark:text-zinc-500">Date</Label>
            <p className="text-base text-slate-900 dark:text-white font-medium">{date}</p>
          </div>
        </div>
        <div>
          <Label className="text-xs uppercase text-slate-500 dark:text-zinc-500">Notes</Label>
          <p className={cn(
            "whitespace-pre-wrap",
            notes 
              ? "text-sm text-slate-600 dark:text-zinc-400" 
              : "italic text-slate-400 dark:text-zinc-600"
          )}>
            {notes || "No additional notes"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button 
          onClick={onNext} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          See Workout Details
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete} 
          disabled={isDeleting} 
          className="flex-1"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}