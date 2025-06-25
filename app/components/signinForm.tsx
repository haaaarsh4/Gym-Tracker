"use client";

import { useActionState, useState, useTransition } from "react";
import { signInAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "../lib/zodSchemas";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./SubmitButtons";
import { FormError } from "./formError";
import { z } from "zod";
import { signIn } from "../lib/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function SignInmode() { 
    const [Passwordstate, setPasswordstate] = useState(false)   
    const [lastResult, action] = useActionState(signInAction, undefined);

    const[form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: signInSchema,
            });
        },
    
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    });
    return (
        <div className=" gap-4">
        <div className="flex flex-row justify-center items-center text-3xl mb-8 font-bold text-blue-500">
            Login
        </div>
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md"> {/* Adjusted padding */}
                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                    <CardContent className="flex flex-col gap-y-5">
                        {/* Email Field */}
                        <div className="grid gap-y-2">
                            <Label className="text-left text-sm font-medium">Email</Label>
                            <FontAwesomeIcon icon={faUser} className=" absolute px-4 py-10" />
                            <Input
                                name={fields.email.name}
                                defaultValue={fields.email.initialValue as string}
                                key={fields.email.key}
                                placeholder="Enter your Email Address"
                                className="w-full px-10"
                            />
                            <p className="text-red-500 text-sm">{fields.email.errors}</p>
                        </div>
                        {/* Password Field */}
                        <div className="grid gap-y-2">
                            <Label className="text-left text-sm font-medium">Password</Label>
                            <div className="flex rounded-md">
                                <FontAwesomeIcon icon={faLock} className=" absolute px-4 py-3" />
                                <Input
                                    name={fields.password.name}
                                    key={fields.password.key}
                                    type={Passwordstate?"text":"password"}
                                    defaultValue={fields.password.initialValue as string}
                                    placeholder="Enter your password"
                                    className="w-full px-10"
                                />
                                <div onClick={()=>{
                                setPasswordstate(!Passwordstate)
                                }}>
                                {
                                    Passwordstate?<FontAwesomeIcon icon={faEye} className=" absolute right-16 py-3" />: <FontAwesomeIcon icon={faEyeSlash} className=" absolute right-16 py-3" />
                                } 
                                </div>
                            </div>
                            <p className="text-red-500 text-sm">{fields.password.errors}</p>
                        </div>
                        <FormError message=""/>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Submit" className="w-full" />
                    </CardFooter>
                </form>
            </div>
        </div>        
        </div>
    );
}