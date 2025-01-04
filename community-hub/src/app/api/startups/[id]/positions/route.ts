import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify startup ownership
    const startup = await prisma.startup.findUnique({
      where: { id: context.params.id },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    if (startup.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Create position with requirements
    const position = await prisma.position.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        location: data.location,
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        equity: data.equity,
        stipend: data.stipend,
        startup: {
          connect: { id: context.params.id },
        },
        requirements: {
          create: data.requirements.map((skill: string) => ({
            skill,
          })),
        },
      },
      include: {
        requirements: true,
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(position);
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
