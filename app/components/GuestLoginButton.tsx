// app/components/GuestLoginButton.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function GuestLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email: "guest@workouttracker.com",
        password: "GuestDemo2024!",
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Guest login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <p className="text-sm text-slate-400">
      Want to explore first?{" "}
      <button
        onClick={handleGuestLogin}
        disabled={isLoading}
        className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Loading..." : "Try as guest"}
      </button>
    </p>
  );
}