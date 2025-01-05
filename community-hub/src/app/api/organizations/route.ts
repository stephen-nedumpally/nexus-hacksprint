import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const organizations = await prisma.organization.findMany({
      include: {
        departments: {
          include: {
            courses: {
              include: {
                _count: {
                  select: {
                    enrollments: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
