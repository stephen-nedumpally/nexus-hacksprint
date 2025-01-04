import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        projects: true,
      },
    });

    return NextResponse.json(profile || { userId: session.user.id });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const { projects, ...profileData } = data;

    // First, find the existing profile
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Use transaction to ensure data consistency
    const profile = await prisma.$transaction(async (tx) => {
      // Create or update the profile
      const updatedProfile = await tx.profile.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          ...profileData,
        },
        update: profileData,
      });

      // If there are existing projects, delete them
      if (existingProfile) {
        await tx.project.deleteMany({
          where: {
            profileId: existingProfile.id,
          },
        });
      }

      // Create new projects if any
      if (projects?.length > 0) {
        await tx.project.createMany({
          data: projects.map((project: any) => ({
            ...project,
            profileId: updatedProfile.id,
          })),
        });
      }

      // Return the complete profile with projects
      return tx.profile.findUnique({
        where: {
          id: updatedProfile.id,
        },
        include: {
          projects: true,
        },
      });
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    return new NextResponse(
      error.message || "Internal Server Error", 
      { status: 500 }
    );
  }
}
