import { useState, useEffect, useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { SubmitButton } from './SubmitButtons';
import { editWorkoutStep1Schema } from '../lib/zodSchemas';
import { editStep1Action } from '../actions';

interface iAppProps {
    workoutId: string,
    title: string;
    date: string;
    notes: string;
    onNext: () => void;
}

function formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for timezone offset
    return offsetDate.toISOString().slice(0, 16); // Extract 'YYYY-MM-DDTHH:mm'
}  

export function EditWorkoutStep1({ workoutId, title, date, notes, onNext } : iAppProps) {
    const [lastResult, action] = useActionState(editStep1Action, undefined);

    const normalizedLastResult = 
    lastResult && 'status' in lastResult 
        ? lastResult 
        : null; // Filter out incompatible types

    const [form, fields] = useForm({
        lastResult: normalizedLastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: editWorkoutStep1Schema,
            });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    });

    useEffect(() => {
        if (lastResult) {
            onNext(); // Move to next step only after successful submission
        }
    }, [lastResult, onNext]);    
    
    return (
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <input 
            type="hidden" 
            name={fields.workoutId.name} 
            defaultValue={workoutId} 
            key={fields.workoutId.key}
        />
        <div className="flex flex-col gap-y-2 mb-4">
            <Label>Full name</Label>
            <Input name={fields.title.name} key={fields.title.key} defaultValue={title} placeholder="Workout Title" className="w-full"/>
            <p className="text-red-500 text-sm">{fields.title.errors}</p>
        </div>
  
        <div className="flex flex-col gap-y-2 mb-4">
            <Label>Date</Label>
            <Input
                type="datetime-local"
                name={fields.date.name}
                defaultValue={formatDateForInput(date)}
                key={fields.date.key}
                className="flex flex-col justify-between"
            />
            <p className="text-red-500 text-sm">{fields.date.errors}</p>
        </div>
  
        <div className="flex flex-col gap-y-4 mb-4">
            <Label className="">Notes (Optional)</Label>
            <Textarea
                name={fields.notes.name}
                defaultValue={notes}
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