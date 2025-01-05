import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { organizationId, departmentId, courseIds } = await request.json();

    if (!organizationId || !departmentId || !courseIds) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user's profile or create one if it doesn't exist
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let profile = user.profile;

    if (!profile) {
      // Create a new profile with required fields
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          organizationId,
          departmentId,
          source: "DIRECT", // Default value
          education: "NOT_SPECIFIED", // Default value
          status: "STUDENT", // Default value
          advancedSkills: [],
          intermediateSkills: [],
          beginnerSkills: [],
        },
      });
    } else {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          organizationId,
          departmentId,
        },
      });
    }

    // Delete existing enrollments
    await prisma.courseEnrollment.deleteMany({
      where: { profileId: profile.id },
    });

    // Create new enrollments
    if (courseIds.length > 0) {
      await prisma.courseEnrollment.createMany({
        data: courseIds.map((courseId: string) => ({
          courseId,
          profileId: profile.id,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating courses:", error.message);
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
