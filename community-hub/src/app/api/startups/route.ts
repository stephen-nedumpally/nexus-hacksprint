import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const startups = await prisma.startup.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Create startup with positions
    const startup = await prisma.startup.create({
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
        user: {
          connect: { id: session.user.id },
        },
        positions: {
          create: data.positions.map((position: any) => ({
            title: position.title,
            description: position.description,
            type: position.type,
            location: position.location,
            responsibilities: position.responsibilities,
            qualifications: position.qualifications,
            equity: position.equity,
            stipend: position.stipend,
            requirements: position.requirements,
          })),
        },
      },
      include: {
        positions: true,
      },
    });

    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
