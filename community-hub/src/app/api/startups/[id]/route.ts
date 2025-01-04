import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        positions: true,
        likes: true,
        dislikes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error fetching startup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startup' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
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

    // Update startup
    const updatedStartup = await prisma.startup.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
        foundedYear: data.foundedYear,
        teamSize: data.teamSize,
        domain: data.domain,
        website: data.website,
        problem: data.problem,
        solution: data.solution,
        market: data.market,
        traction: data.traction,
        funding: data.funding,
      },
      include: {
        positions: true,
      },
    });

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error('Error updating startup:', error);
    return NextResponse.json(
      { error: 'Failed to update startup' },
      { status: 500 }
    );
  }
}
