import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Step1Action } from "../actions";
import { addWorkoutStep1Schema } from "../lib/zodSchemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { Car } from "lucide-react";
import { SubmitButton } from "./SubmitButtons";

export function Step1({ onNext }: { onNext: (workoutId: string) => void }) {
    const [lastResult, action] = useActionState(Step1Action, undefined);

    const [form, fields] = useForm({
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: addWorkoutStep1Schema,
            });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    });

    React.useEffect(() => {
        if (lastResult && 'id' in lastResult) {
            onNext(lastResult.id);
        }
    }, [lastResult, onNext]);
    
    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>  
            <div className="flex flex-col gap-y-2 mb-4">
                <Label className="">Title</Label>
                <Input
                    name={fields.title.name}
                    defaultValue={fields.title.initialValue as string}
                    key={fields.title.key}
                    placeholder="Workout Title"
                    className="w-full"
                />
                <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2 mb-4">
                <Label className="">Date</Label>
                <Input
                    type="datetime-local"
                    name={fields.date.name}
                    defaultValue={fields.date.initialValue as string}
                    key={fields.date.key}
                    className="flex flex-col justify-between"
                />
                <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>
            <div className="flex flex-col gap-y-4 mb-s">
                <Label className="">Notes (Optional)</Label>
                <Textarea
                    name={fields.notes.name}
                    defaultValue={fields.notes.initialValue as string}
                    key={fields.notes.key}
                    placeholder="Include general notes about your workout, future goals, or anything else you'd like to track"
                    className="w-full"
                />
                <p className="text-red-500 text-sm">{fields.notes.errors}</p>
            </div>
            <SubmitButton text="Next" />
        </form>
    );    
}