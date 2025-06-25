"use server";

import { signIn } from "./auth";

export async function handleGoogleSignIn() {
    return await signIn("google");
}