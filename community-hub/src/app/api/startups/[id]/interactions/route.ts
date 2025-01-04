import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ liked: false, disliked: false });
  }

  try {
    const [like, dislike] = await Promise.all([
      prisma.like.findUnique({
        where: {
          startupId_userId: {
            startupId: params.id,
            userId: session.user.id,
          },
        },
      }),
      prisma.dislike.findUnique({
        where: {
          startupId_userId: {
            startupId: params.id,
            userId: session.user.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      liked: !!like,
      disliked: !!dislike,
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
