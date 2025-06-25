"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Logo from '@/public/WORKOUT TRACKER.png';
import Image from "next/image";
import { GoogleAuthButton } from "./SubmitButtons";
import { SignInmode } from "./signinForm";
import { SignUpmode } from "./signupform";
import { handleGoogleSignIn } from "../lib/signin";

export function AuthModal() {
    const [isSignUp, setIsSignUp] = useState(false);

    const handleToggleView = () => {
        setIsSignUp((prev) => !prev);
    };

    const handleGoogleAuth = async () => {
        await handleGoogleSignIn();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Try for free
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px]">
                <div className="mt-5">
                    {isSignUp ? (
                        <>
                            <SignUpmode />
                            <p className="text-center text-sm text-gray-600">
                            By signing up, you agree to the <span className="font-bold text-gray-400">Terms of Service</span> and <span className="font-bold text-gray-400">Privacy Policy</span>
                            </p>
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?
                            <Button
                                variant="link"
                                className="text-blue-500 hover:underline mt-3"
                                onClick={handleToggleView}
                            >
                                Sign In
                            </Button>
                            </p>
                        </>
                    ) : (
                        <>
                            <SignInmode />
                            <div className="mx-auto my-1 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                                or
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                    <GoogleAuthButton onClick={handleGoogleAuth} />
                            </div>
                            <p className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?&nbsp;
                                <Button
                                    variant="link"
                                    className="text-blue-500 hover:underline"
                                    onClick={handleToggleView}
                                >
                                    Sign up
                                </Button>
                            </p>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}