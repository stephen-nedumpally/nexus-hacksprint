import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const startupId = params.id;
    const userId = session.user.id;

    // Check if user has already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        startupId,
        userId,
      },
    });

    if (existingLike) {
      // Remove like if it exists
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Remove dislike if it exists
      await prisma.dislike.deleteMany({
        where: {
          startupId,
          userId,
        },
      });

      // Add new like
      await prisma.like.create({
        data: {
          startupId,
          userId,
        },
      });
    }

    // Get updated startup with counts
    const updatedStartup = await prisma.startup.findUnique({
      where: {
        id: startupId,
      },
      include: {
        likes: true,
        dislikes: true,
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error('[STARTUP_LIKE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
