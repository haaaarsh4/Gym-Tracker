"use server";

import bcrypt from 'bcryptjs';
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import {parseWithZod} from '@conform-to/zod'
import { addWorkoutStep1Schema, addWorkoutStep2Schema, editWorkoutStep1Schema, editWorkoutStep2Schema, gallarySchema, onboardingSchema, onboardingSchemaValidation, settingsSchema, signInSchema, signInSchemaValidation, signUpSchemaValidation } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { z } from 'zod';
import { signIn } from './lib/auth';

export async function OnboardingAction(prevState: any, formData: FormData) {
    const session = await requireUser()

    const submission = await parseWithZod(formData, {
        schema: onboardingSchemaValidation({
            async isUsernameUnique() {
                const exisitingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get('userName') as string,
                    },
                });

                return !exisitingUsername;
            },
        }),

        async: true,
    })

    if (submission.status !== "success"){
        return submission.reply()
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            userName: submission.value.userName,
            name: submission.value.fullName,
        }
    });

    // Fetching the user's email
    const userEmail = await prisma.user.findUnique({
        where: {
            userName: formData.get('userName') as string,
        },
        select: {
            email: true, // Ensure you're selecting the email field
        },
    });

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: submission.value.fullName,
          toEmail: userEmail?.email // Access the email property
        })
      });      

    return redirect('/dashboard')
}

export async function signInAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Parse and validate form data using Zod schema
    const submission = await parseWithZod(formData, {
        schema: signInSchemaValidation({
            // Check if email exists in the database
            async emailExists() {
                const existingEmail = await prisma.user.findUnique({
                    where: { email },
                });
                return !!existingEmail; // Ensure email exists
            },

            // Check if password matches the one stored for the email
            async passwordMatches() {
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    return false; // No user found, return false
                }

                const inputPassword = user.password || '';

                const passwordMatch = await bcrypt.compare(password, inputPassword);
                return passwordMatch; // Return result of password comparison
            },
        }),

        async: true, // Handle async validation
    });

    if (submission.status !== 'success') {
        return submission.reply(); // Return validation errors
    }

    // If validation is successful, redirect to the dashboard or desired page
    await signIn("credentials", {
        redirect: false,
        email,
        password,
    });
    return redirect('/dashboard'); // Replace with your actual redirect route
}

export async function signUpAction(prevState: any, formData: FormData) {
    const submission = await parseWithZod(formData, {
        schema: signUpSchemaValidation({
            async isEmailUnique() {
                const exisitingEmail = await prisma.user.findUnique({
                    where: {
                        email: formData.get('email') as string,
                    },
                });

                return !exisitingEmail;
            },
        }),

        async: true,
    })

    if (submission.status !== "success"){
        return submission.reply()
    }

    const password = formData.get('password') as string;

    const hashedPassword = await bcrypt.hash(password, 10);
    const email = formData.get('email') as string

    const data = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
        },
    });

    await signIn("credentials", {
        redirect: false,
        email,
        password,
    });

    return redirect('/onboarding')
}

export async function SettingsAction(prevState:any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: settingsSchema,
    });

    if (submission.status !== "success"){
        return submission.reply();
    }

    const user = await prisma.user.update({
        where: {
            id: session.user?.id as string,
        },
        data: {
            name: submission.value.fullname,
            image: submission.value.profileImage,
        }, 
    });

    return redirect("/dashboard/settings");
}

export async function Step1Action(prevState: unknown, formData: FormData) {
    const session = await requireUser();

    if (!session.user?.id) {
        throw new Error("Unauthorized");
    }

    const submission = parseWithZod(formData, {
        schema: addWorkoutStep1Schema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const title = formData.get("title") as string;
    const date = new Date(formData.get("date") as string);
    const notes = formData.get("notes") as string || null;

    const data = await prisma.workout.create({
        data: {
            title,
            date,
            notes,
            userId: session.user.id,
        },
    });

    return { id: data.id } as const;
}

export async function Step2Action(prevState: unknown, formData: FormData) {

    const session = await requireUser();
    if (!session.user?.id) {
        throw new Error("Unauthorized");
    }

    const exercisesCount = Array.from(formData.keys())
        .filter((key) => key.match(/^exercises\[\d+\]\.exercisename$/))
        .length;

    const parsedExercises = [];
    for (let i = 0; i < exercisesCount; i++) {
        const exercisename = formData.get(`exercises[${i}].exercisename`) as string;
        const muscleGroup = formData.get(`exercises[${i}].muscleGroup`) as string;

        if (!exercisename || !muscleGroup) {
            console.warn(`Skipping exercise ${i}: Missing data`);
            continue;
        }

        const sets = [];
        let setIndex = 0;
        while (formData.has(`exercises[${i}].sets[${setIndex}].weight`)) {
            const weight = parseFloat(formData.get(`exercises[${i}].sets[${setIndex}].weight`) as string);
            const reps = parseInt(formData.get(`exercises[${i}].sets[${setIndex}].reps`) as string);

            if (isNaN(weight) || isNaN(reps)) {
                console.warn(`Skipping set ${setIndex} for exercise ${i}: Invalid data`);
                continue;
            }

            sets.push({ weight, reps });
            setIndex++;
        }

        parsedExercises.push({ exercisename, muscleGroup, sets });
    }

    // Update formData to align with schema
    parsedExercises.forEach((exercise, i) => {
        formData.set(`exercises[${i}].exercisename`, exercise.exercisename);
        formData.set(`exercises[${i}].muscleGroup`, exercise.muscleGroup);

        exercise.sets.forEach((set, j) => {
            formData.set(`exercises[${i}].sets[${j}].weight`, String(set.weight));
            formData.set(`exercises[${i}].sets[${j}].reps`, String(set.reps));
        });
    });

    const submission = parseWithZod(formData, {
        schema: addWorkoutStep2Schema,
    });

    console.log(submission)

    console.log("HERE");

    if (submission.status !== "success") {
        return submission.reply();
    }

    console.log("HERE");

    const { workoutId, exercises } = submission.value;

    // Handle sets separately since createMany doesn't support nested creates
    for (const exercise of exercises) {
        const createdExercise = await prisma.exercise.create({
            data: {
                workoutId,
                exerciseName: exercise.exercisename,
                muscleGroup: exercise.muscleGroup,
            },
        });

        // Create sets for this exercise
        await prisma.set.createMany({
            data: exercise.sets.map((set) => ({
                exerciseId: createdExercise.id,
                weight: set.weight,
                reps: set.reps,
            })),
        });
    }

    redirect("/dashboard/addWorkout");
}

export async function editStep1Action(prevState: unknown, formData: FormData) {
    const session = await requireUser();

    if (!session.user?.id) {
        throw new Error("Unauthorized");
    }

    const submission = parseWithZod(formData, {
        schema: editWorkoutStep1Schema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const title = formData.get("title") as string;
    const date = new Date(formData.get("date") as string);
    const notes = formData.get("notes") as string || null;

    const data = await prisma.workout.update({
        where: {
            id: formData.get("workoutId") as string,
        },
        data: {
            title,
            date,
            notes,
            userId: session.user.id,
        },
    });

    return { id: data.id } as const;
}

interface WorkoutSet {
    weight: number;
    reps: number;
}

interface Exercise {
    exercisename: string;
    muscleGroup: string;
    sets: WorkoutSet[];
}

export async function editStep2Action(prevState: unknown, formData: FormData) {
    const session = await requireUser();
    if (!session.user?.id) {
        throw new Error("Unauthorized");
    }

    const exercisesCount = Array.from(formData.keys())
        .filter((key) => key.match(/^exercises\[\d+\]\.exercisename$/))
        .length;

    const parsedExercises = [];
    for (let i = 0; i < exercisesCount; i++) {
        const exercisename = formData.get(`exercises[${i}].exercisename`) as string;
        const muscleGroup = formData.get(`exercises[${i}].muscleGroup`) as string;

        if (!exercisename || !muscleGroup) {
            console.warn(`Skipping exercise ${i}: Missing data`);
            continue;
        }

        const sets = [];
        let setIndex = 0;
        while (formData.has(`exercises[${i}].sets[${setIndex}].weight`)) {
            const weight = parseFloat(formData.get(`exercises[${i}].sets[${setIndex}].weight`) as string);
            const reps = parseInt(formData.get(`exercises[${i}].sets[${setIndex}].reps`) as string);

            if (isNaN(weight) || isNaN(reps)) {
                console.warn(`Skipping set ${setIndex} for exercise ${i}: Invalid data`);
                continue;
            }

            sets.push({ weight, reps });
            setIndex++;
        }

        parsedExercises.push({ exercisename, muscleGroup, sets });
    }

    // Update formData to align with schema
    parsedExercises.forEach((exercise, i) => {
        formData.set(`exercises[${i}].exercisename`, exercise.exercisename);
        formData.set(`exercises[${i}].muscleGroup`, exercise.muscleGroup);

        exercise.sets.forEach((set, j) => {
            formData.set(`exercises[${i}].sets[${j}].weight`, String(set.weight));
            formData.set(`exercises[${i}].sets[${j}].reps`, String(set.reps));
        });
    });

    const submission = parseWithZod(formData, {
        schema: editWorkoutStep2Schema, // Make sure this schema includes workoutId
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const { workoutId, exercises } = submission.value;

    // Verify the workout belongs to the user
    const workout = await prisma.workout.findUnique({
        where: {
            id: workoutId,
            userId: session.user.id,
        },
    });

    if (!workout) {
        throw new Error("Workout not found or unauthorized");
    }

    // Transaction to ensure atomicity of the update
    await prisma.$transaction(async (tx) => {
        // Delete existing exercises and sets
        await tx.set.deleteMany({
            where: {
                exercise: {
                    workoutId: workoutId
                }
            }
        });
        
        await tx.exercise.deleteMany({
            where: {
                workoutId: workoutId
            }
        });

        // Create new exercises and sets
        for (const exercise of exercises) {
            const createdExercise = await tx.exercise.create({
                data: {
                    workoutId,
                    exerciseName: exercise.exercisename,
                    muscleGroup: exercise.muscleGroup,
                },
            });

            await tx.set.createMany({
                data: exercise.sets.map((set) => ({
                    exerciseId: createdExercise.id,
                    weight: set.weight,
                    reps: set.reps,
                })),
            });
        }
    });

    redirect("/dashboard/calendar");
}

export async function gallaryAction(prevState: any, formData: FormData) {
    const session = await requireUser();
  
    if (!session.user?.id) {
      throw new Error("Unauthorized");
    }
  
    const userId = session.user.id;
  
    const submission = parseWithZod(formData, {
      schema: gallarySchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const imageUrl = submission.value.gallaryImage;
  
    await prisma.gallery.create({
      data: {
        userId,
        imageUrl,
      },
    });
  
    return { success: true };
  }  