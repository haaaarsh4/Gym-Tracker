// app/page.tsx
import Image from "next/image";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import DLimage from "@/public/DLimage2.jpg";
import { AuthModal } from "./components/AuthModal";
import { GuestLoginButton } from "./components/GuestLoginButton";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <>
      <div className="min-h-screen bg-black px-4 flex flex-col">
        <div className="flex-1 grid md:grid-cols-2 items-center px-6 lg:px-20 py-12 relative">
          {/* Left Content */}
          <div className="space-y-10 text-white">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-5xl lg:text-7xl font-bold leading-[0.95]">
                Shape
                <br />
                <span className="text-blue-500">Yourself</span>
              </h1>
              <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
              <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-xl font-light">
                Every rep and every set — tracked, analyzed, and conquered with purpose.
                Your journey isn't just about lifting; it's about progress, and we're here to capture every step.
              </p>
            </div>
            <div className="space-y-4">
              <AuthModal />
              <GuestLoginButton />
            </div>
          </div>

          {/* Right Side Image */}
          <div className="relative w-full h-[300px] md:h-[500px]">
            <Image
              src={DLimage}
              alt="Workout image"
              fill
              className="object-cover rounded-xl shadow-lg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}