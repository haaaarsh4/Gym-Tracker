"use client";

import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { z } from "zod";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseWithZod } from "@conform-to/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Step1 } from "@/app/components/addWorkoutStep1";
import { Step2 } from "@/app/components/addWorkoutStep2";

export default function AddWorkoutRoute() {
    const [step, setStep] = useState(1);
    const [workoutId, setWorkoutId] = useState<string | null>(null);

    // Handle step navigation with workout ID
    const handleNext = (id: string) => {
        setWorkoutId(id);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Add Today's Workout</CardTitle>
                    <CardDescription>In this section, you can add your recent workout!</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-y-5">
                    {step === 1 && (
                        <Step1 onNext={handleNext} />
                    )}

                    {step === 2 && workoutId && (
                        <Step2 workoutId={workoutId}/>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}