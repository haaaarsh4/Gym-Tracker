import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid workout ID" }, { status: 400 });
  }

  try {
    const workoutData = await prisma.workout.findUnique({
      where: { id },
      select: {
        title: true,
        date: true,
        notes: true,
      },
    });

    if (!workoutData) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    return NextResponse.json(workoutData);
  } catch (error) {
    console.error("Error fetching workout data:", error);
    return NextResponse.json({ error: "Failed to fetch workout data" }, { status: 500 });
  }
}