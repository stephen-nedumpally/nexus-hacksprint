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

    // Check if user has already disliked
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        startupId,
        userId,
      },
    });

    if (existingDislike) {
      // Remove dislike if it exists
      await prisma.dislike.delete({
        where: {
          id: existingDislike.id,
        },
      });
    } else {
      // Remove like if it exists
      await prisma.like.deleteMany({
        where: {
          startupId,
          userId,
        },
      });

      // Add new dislike
      await prisma.dislike.create({
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
    console.error('[STARTUP_DISLIKE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
