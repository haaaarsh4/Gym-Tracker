import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // Import auth from your NextAuth v5 config
import prisma from "@/app/lib/db";

export async function GET() {
  try {
    // Get the current user's session using NextAuth v5
    const session = await auth();
    
    // If no session, return empty array or error
    if (!session?.user?.email) {
      return NextResponse.json([]);
    }

    // Find the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json([]);
    }

    // Only fetch workouts for the current user
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id  // This is the key change!
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });
    
    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json({ error: "Unable to fetch workouts" }, { status: 500 });
  }
}