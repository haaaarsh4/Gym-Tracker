"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useState, useTransition } from "react";
import { SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";

interface iAppProps {
    fullName: string;
    email: string;
    userName: string;
    profileImage: string;
}

export function SettingsForm({fullName, email, profileImage, userName} : iAppProps) {
    const [lastResult, action] = useActionState(SettingsAction, undefined)
    const [currentProfileImage, setCurrentProfileImage] = useState(profileImage)
    const [isPending, startTransition] = useTransition()
    
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }){
            return parseWithZod(formData, {
                schema: settingsSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const handleDeleteImage = () => {
        setCurrentProfileImage("");
    }

    // Enhanced form submission with optimistic updates
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        startTransition(() => {
            action(formData);
        });
        
        // Show immediate feedback
        toast.success("Updating profile...");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings!</CardDescription>
            </CardHeader>

            <form id={form.id} onSubmit={handleSubmit} noValidate>
                <CardContent className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                        <Label>Full name</Label>
                        <Input 
                            name={fields.fullname.name} 
                            key={fields.fullname.key} 
                            defaultValue={fullName} 
                            placeholder="Harsh Upadhyay"
                            disabled={isPending}
                        />
                        <p className="text-red-500 text-sm">{fields.fullname.errors}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Email</Label>
                        <Input disabled defaultValue={email} placeholder="HarshUpadhyay@test.com" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Username</Label>
                        <Input disabled defaultValue={userName} placeholder="TestUser" />
                    </div>
                    <div className="grid gap-y-5">
                        <input 
                            type="hidden" 
                            name={fields.profileImage.name} 
                            key={fields.profileImage.key} 
                            value={currentProfileImage}
                        />
                        <Label>Profile Image</Label>
                        {currentProfileImage ? (
                            <div className="relative size-16">
                                <Image 
                                    src={currentProfileImage}
                                    alt="Profile Image"
                                    width={300}
                                    height={300}
                                    className="rounded-lg size-16 object-cover"
                                />
                                <Button 
                                    onClick={handleDeleteImage} 
                                    variant="destructive" 
                                    size="icon" 
                                    type="button" 
                                    className="absolute -top-3 -right-3"
                                    disabled={isPending}
                                >
                                    <X className="size-4"/>
                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone 
                                onClientUploadComplete={(res) => {
                                    setCurrentProfileImage(res[0].url);
                                    toast.success("Profile Image Uploaded - Don't forget to save!");
                                }} 
                                onUploadError={(error) => {
                                    console.log("Upload error:", error);
                                    toast.error(error.message);
                                }}
                                endpoint="imageUploader" 
                            />
                        )}
                    </div>
                    <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
                </CardContent>
                <CardFooter>
                    <SubmitButton text={isPending ? "Saving..." : "Save Changes"} />
                </CardFooter>
            </form>
        </Card>
    )
}