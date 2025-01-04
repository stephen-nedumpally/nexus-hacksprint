import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        source: data.source,
        education: data.education,
        status: data.status,
        advancedSkills: data.advancedSkills,
        intermediateSkills: data.intermediateSkills,
        beginnerSkills: data.beginnerSkills,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        projects: {
          create: data.projects,
        },
      },
      update: {
        source: data.source,
        education: data.education,
        status: data.status,
        advancedSkills: data.advancedSkills,
        intermediateSkills: data.intermediateSkills,
        beginnerSkills: data.beginnerSkills,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        projects: {
          deleteMany: {},
          create: data.projects,
        },
      },
      include: {
        projects: true,
      },
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { verified: true },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error completing verification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
