import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since it's now a Promise in Next.js 15
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" }, 
        { status: 400 }
      );
    }

    // Delete the image from the database
    const deletedImage = await prisma.gallery.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      deletedImage
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    // Handle case where image doesn't exist
    return NextResponse.json(
      { error: "Failed to delete image" }, 
      { status: 500 }
    );
  }
}