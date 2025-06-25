import Image from "next/image";
import { Navbar } from "./components/Navbar";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import DLimage from "@/public/DLimage2.jpg";
import { AuthModal } from "./components/AuthModal";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <>
      <div className="min-h-screen bg-black px-4 flex flex-col">
        <Navbar />
        <div className="flex-1 grid md:grid-cols-2 items-center px-6 lg:px-20 py-12 relative">
          {/* Left Content */}
          <div className="z-10 space-y-6 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold italic leading-tight">
              Shape Yourself
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-md">
              Every rep and every set — tracked, analyzed, and conquered with purpose.
              Your journey isn’t just about lifting; it’s about progress, and we’re here to capture every step.
            </p>
            <AuthModal />
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