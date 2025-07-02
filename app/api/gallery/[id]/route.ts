// app/api/gallery/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise in Next.js 15
    const params = await context.params;
    
    // Get the current user session
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Find the user
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

    // First, check if the image exists and belongs to the current user
    const existingImage = await prisma.gallery.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' }, 
        { status: 404 }
      );
    }

    // Check if the image belongs to the current user
    if (existingImage.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - you can only delete your own images' }, 
        { status: 403 }
      );
    }

    // Delete the image (only if it belongs to the current user)
    await prisma.gallery.delete({
      where: {
        id: params.id,
        userId: user.id, // Double-check ownership
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}