import { conformZodMessage } from '@conform-to/zod'
import {z} from 'zod'

export const onboardingSchema = z.object({
    fullName: z.string().min(3).max(150),
    userName: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {message: "Username can only contain letters, numbers and -"}),
})

export function onboardingSchemaValidation(options?: {
    isUsernameUnique: () => Promise<boolean>
}){
    return z.object({
    userName: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {message: "Username can only contain letters, numbers and -"})
    .pipe(
        z.string().superRefine((_, ctx) => {
            if (typeof options?.isUsernameUnique !== "function") {
                ctx.addIssue({
                    code: 'custom',
                    message: conformZodMessage.VALIDATION_UNDEFINED,
                    fatal: true,
                })
                return;
            }

            return options.isUsernameUnique().then((isUnique) => {
                if(!isUnique){
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Username already taken'
                    })
                }
            })
        })
    ),
    fullName: z.string().min(3).max(150),
    });
}

export const settingsSchema = z.object({
    fullname: z.string().min(3).max(150),
    profileImage: z.string(),
})

export const signInSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
})

export const signUpSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(8),
})

export function signInSchemaValidation(options?: {
    emailExists: (email: string) => Promise<boolean>,
    passwordMatches: (email: string, password: string) => Promise<boolean>,
}) {
    return z
        .object({
            email: z
                .string()
                .min(1, 'Email is required')
                .email('Invalid email')
                .pipe(
                    z.string().superRefine((email, ctx) => {
                        if (typeof options?.emailExists !== 'function') {
                            ctx.addIssue({
                                code: 'custom',
                                message: 'Validation function undefined',
                                fatal: true,
                            });
                            return;
                        }

                        return options.emailExists(email).then((exists) => {
                            if (!exists) {
                                ctx.addIssue({
                                    code: 'custom',
                                    message: 'No user exists with this Email',
                                });
                            }
                        });
                    })
                ),
            password: z
                .string()
                .min(8, 'Password must be at least 8 characters long'),
        })
        .superRefine((data, ctx) => {
            if (typeof options?.passwordMatches !== 'function') {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Validation function undefined',
                    fatal: true,
                });
                return;
            }

            return options.passwordMatches(data.email, data.password).then((matches) => {
                if (!matches) {
                    ctx.addIssue({
                        path: ['password'], // Attribute error to the password field
                        code: 'custom',
                        message: 'Incorrect Password',
                    });
                }
            });
        });
}

export function signUpSchemaValidation(options?: {
    isEmailUnique: () => Promise<boolean>;
}) {
    return z
        .object({
            email: z
                .string()
                .min(1, 'Email is required')
                .email('Invalid email')
                .pipe(
                    z.string().superRefine((_, ctx) => {
                        if (typeof options?.isEmailUnique !== 'function') {
                            ctx.addIssue({
                                code: 'custom',
                                message: 'Validation function undefined',
                                fatal: true,
                            });
                            return;
                        }

                        return options.isEmailUnique().then((isUnique) => {
                            if (!isUnique) {
                                ctx.addIssue({
                                    code: 'custom',
                                    message: 'Account with this Email already exists',
                                });
                            }
                        });
                    })
                ),
            password: z.string().min(8, 'Password must be at least 8 characters long'),
            confirmPassword: z
                .string()
                .min(8, 'Confirm Password must be at least 8 characters long'),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'], // Points to the field with the error
            message: 'Passwords do not match',
        });
}

export const addWorkoutStep1Schema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z
        .string()
        .min(1, "Date and time are required")
        .refine((str) => !isNaN(new Date(str).getTime()), "Invalid date and time")
        .transform((str) => new Date(str)),
    notes: z.string().optional(),
});

export const addWorkoutStep2Schema = z.object({
    workoutId: z.string(),
    exercises: z.array(
      z.object({
        exercisename: z.string().min(1, "Exercise Name is required"),
        muscleGroup: z.string().min(1, "Muscle Group is required"),
        sets: z.array(
          z.object({
            weight: z.coerce.number().nonnegative("Weight must be greater than 0"),
            reps: z.coerce.number().int().positive("Reps must be greater than 0"),
          })
        ),
      })
    ).min(1, "At least one exercise is required"),
});  

export const editWorkoutStep1Schema = z.object({
    workoutId: z.string(),
    title: z.string().min(1, "Title is required"),
    date: z
        .string()
        .min(1, "Date and time are required")
        .refine((str) => !isNaN(new Date(str).getTime()), "Invalid date and time")
        .transform((str) => new Date(str)),
    notes: z.string().optional(),
});

export const editWorkoutStep2Schema = z.object({
    workoutId: z.string(),
    exercises: z.array(
      z.object({
        exercisename: z.string().min(1, "Exercise Name is required"),
        muscleGroup: z.string().min(1, "Muscle Group is required"),
        sets: z.array(
          z.object({
            weight: z.coerce.number().nonnegative("Weight must be greater than or equal to 0"),
            reps: z.coerce.number().int().positive("Reps must be greater than 0"),
          })
        ).min(1, "At least one set is required"),
      })
    ).min(1, "At least one exercise is required"),
});

export const gallarySchema = z.object({
    gallaryImage: z.string(),
  });  