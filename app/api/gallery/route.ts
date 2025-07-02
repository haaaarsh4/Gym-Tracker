import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // Import auth from your NextAuth v5 config
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get the current user session
        const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Find the user by email to get their ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Fetch ONLY the current user's gallery images
    const images = await prisma.gallery.findMany({
      where: {
        userId: user.id, // This is the key fix!
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}