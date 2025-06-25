import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    // Extract the workoutId from the query parameters
    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json(
        { error: "Missing workoutId in the request" },
        { status: 400 }
      );
    }

    // Fetch exercises with their sets for the given workoutId
    const exercises = await prisma.exercise.findMany({
      where: { workoutId },
      include: {
        sets: true, // Include the related sets for each exercise
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json({ error: "Unable to fetch exercises" }, { status: 500 });
  }
}