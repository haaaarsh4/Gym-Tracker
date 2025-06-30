"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
                <Button>Try for free</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="sr-only">
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </DialogTitle>
                </DialogHeader>
                
                {isSignUp ? (
                    <>
                        <SignUpmode />
                        <div className="text-center text-sm text-gray-500">
                            By signing up, you agree to the Terms of Service and Privacy Policy
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Already have an account?</span>
                            <Button 
                                variant="link" 
                                onClick={handleToggleView}
                                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                            >
                                Sign In
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <SignInmode />
                        <div className="text-center text-sm text-gray-500">or</div>
                        <GoogleAuthButton onClick={handleGoogleAuth} />
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Don't have an account?</span>
                            <Button 
                                variant="link" 
                                onClick={handleToggleView}
                                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                            >
                                Sign up
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}