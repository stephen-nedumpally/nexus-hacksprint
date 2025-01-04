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

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return new NextResponse('Comment content is required', { status: 400 });
    }

    const startupId = params.id;
    const userId = session.user.id;

    // Create new comment
    await prisma.comment.create({
      data: {
        content,
        startupId,
        userId,
      },
    });

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
    console.error('[STARTUP_COMMENT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
