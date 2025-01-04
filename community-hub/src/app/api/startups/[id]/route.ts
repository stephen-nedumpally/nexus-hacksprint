import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        positions: {
          include: {
            requirements: true,
          },
        },
        user: true,
        likes: true,
        dislikes: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        applications: true,
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
