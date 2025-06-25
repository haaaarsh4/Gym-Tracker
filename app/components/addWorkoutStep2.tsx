import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useState } from "react";
import { addWorkoutStep2Schema } from "../lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Step2Action } from "../actions";
import { SubmitButton } from "./SubmitButtons";
import prisma from "../lib/db";
import { useNavigate } from "react-router-dom";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface Step2Props {
    workoutId: string;
}

export function Step2({ workoutId }: Step2Props){
    const [lastResult, action] = useActionState(Step2Action, undefined);
    
    const[form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: addWorkoutStep2Schema,
            });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    });

    // State for dynamic exercises and sets
    const [exercises, setExercises] = useState([
        { exercisename: "", muscleGroup: "", sets: [{ weight: 0, reps: 1 }] },
    ]);

    const addExercise = () => {
        setExercises((prev) => [
            ...prev,
            { exercisename: "", muscleGroup: "", sets: [{ weight: 0, reps: 1 }] },
        ]);
    };

    const addSet = (index: number) => {
        setExercises((prev) =>
            prev.map((exercise, i) =>
                i === index ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 1 }] } : exercise
            )
        );
    };

    const removeSet = (exerciseIndex: number, setIndex: number) => {
        setExercises((prev) => {
            const newExercises = [...prev];
            if (newExercises[exerciseIndex].sets.length > 1) {
                newExercises[exerciseIndex] = {
                    ...newExercises[exerciseIndex],
                    sets: newExercises[exerciseIndex].sets.filter((_, idx) => idx !== setIndex)
                };
            }
            return newExercises;
        });
    };
    
    const removeExercise = (index: number) => {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index: number, key: string, value: string) => {
        setExercises((prev) =>
            prev.map((exercise, i) =>
                i === index ? { ...exercise, [key]: value } : exercise
            )
        );
    };
    
    const handleSetChange = (exerciseIndex: number, setIndex: number, key: string, value: number) => {
        setExercises((prev) =>
            prev.map((exercise, i) =>
                i === exerciseIndex
                    ? {
                          ...exercise,
                          sets: exercise.sets.map((set, j) =>
                              j === setIndex ? { ...set, [key]: value } : set
                          ),
                      }
                    : exercise
            )
        );
    };    

    const getFieldError = (fieldName: string) => {
        if (lastResult?.error && lastResult.error[fieldName]) {
            return lastResult.error[fieldName].join(", ");
        }
        return '';
    };

    // Remove the problematic handleSubmit function entirely
    
    return(
        <div className="grid gap-y-5">
        <form 
            id={form.id} 
            action={action} 
            noValidate
            onSubmit={(e) => {
                // Only allow submission if explicitly triggered
                if (!e.currentTarget.dataset.allowSubmit) {
                    e.preventDefault();
                    return false;
                }
            }}
        >
            <input 
                type="hidden" 
                name={fields.workoutId.name} 
                defaultValue={workoutId} 
                key={fields.workoutId.key}
            />
            {exercises.map((exercise, i) => (
                <div key={i} className="grid gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>Exercise Name</Label>
                        <Input
                            name={`exercises[${i}].exercisename`}
                            defaultValue={exercise.exercisename}
                            placeholder="Exercise Name"
                            onChange={(e) => handleExerciseChange(i, "exercisename", e.target.value)}
                        /> 
                        <p className="text-red-500 text-sm">
                            {getFieldError(`exercises[${i}].exercisename`)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Muscle Group</Label>
                        <Select
                            name={`exercises[${i}].muscleGroup`}
                            defaultValue={exercise.muscleGroup || ""}
                            onValueChange={(value) => handleExerciseChange(i, "muscleGroup", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Muscle Group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Chest">Chest</SelectItem>
                                    <SelectItem value="Shoulders">Shoulders</SelectItem>
                                    <SelectItem value="Triceps">Triceps</SelectItem>
                                    <SelectItem value="Back">Back</SelectItem>
                                    <SelectItem value="Biceps">Biceps</SelectItem>
                                    <SelectItem value="Legs">Legs</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <p className="text-red-500 text-sm">
                            {getFieldError(`exercises[${i}].muscleGroup`)}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                        <div className="flex-1 font-medium">Set</div>
                        <div className="flex-1 font-medium">Weight</div>
                        <div className="flex-1 font-medium">Reps</div>
                        <Button type="button" variant="outline" onClick={() => addSet(i)}>
                            Add Set
                        </Button>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        {exercise.sets.map((set, j) => (
                            <div key={j} className="flex flex-row gap-x-4 items-start">
                                <Label className="flex-1">Set {j + 1}</Label>
                                
                                <div className="flex-1 flex flex-col">
                                    <Input
                                        type="number"
                                        name={`exercises[${i}].sets[${j}].weight`}
                                        defaultValue={set.weight}
                                        placeholder="Weight (lbs)"
                                        className="appearance-none"
                                        onChange={(e) => handleSetChange(i, j, "weight", parseInt(e.target.value) || 0)}
                                    />
                                    {getFieldError(`exercises[${i}].sets[${j}].weight`) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {getFieldError(`exercises[${i}].sets[${j}].weight`)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <Input
                                        type="number"
                                        name={`exercises[${i}].sets[${j}].reps`}
                                        defaultValue={set.reps}
                                        placeholder="Reps"
                                        className="appearance-none"
                                        onChange={(e) => handleSetChange(i, j, "reps", parseInt(e.target.value) || 0)}
                                    />
                                    {getFieldError(`exercises[${i}].sets[${j}].reps`) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {getFieldError(`exercises[${i}].sets[${j}].reps`)}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    className="ml-4"
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeSet(i, j);
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <div className="mt-2 flex gap-x-2">
                            <Button type="button" variant="destructive" onClick={() => removeExercise(i)}>
                                Remove Exercise
                            </Button>
                        </div>
                        <div className="mx-auto mt-4 mb-4 w-full h-px bg-stone-400"></div>
                    </div>
                </div>
            ))}      
            <Button type="button" onClick={addExercise} className="w-full mt-3">
                Add Exercise
            </Button>
            <div className="flex justify-between mt-4">
                <Button type="button" asChild variant="secondary">
                    <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button 
                    type="submit"
                    onClick={(e) => {
                        // Mark form as allowed to submit
                        const form = e.currentTarget.closest('form');
                        if (form) {
                            form.dataset.allowSubmit = 'true';
                        }
                    }}
                >
                    Submit
                </Button>
            </div>      
        </form>
    </div>
    )
}