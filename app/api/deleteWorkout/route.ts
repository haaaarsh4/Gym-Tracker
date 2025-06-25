import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json(
        { error: "Missing workoutId" },
        { status: 400 }
      );
    }

    // Delete associated sets and exercises first due to relations
    await prisma.set.deleteMany({
      where: {
        exercise: {
          workoutId: workoutId
        }
      }
    });

    await prisma.exercise.deleteMany({
      where: {
        workoutId: workoutId
      }
    });

    // Then delete the workout
    await prisma.workout.delete({
      where: {
        id: workoutId
      }
    });

    return NextResponse.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    );
  }
}