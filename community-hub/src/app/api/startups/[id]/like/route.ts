import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Remove any existing dislike
    await prisma.dislike.deleteMany({
      where: {
        startupId: params.id,
        userId: session.user.id,
      },
    });

    // Add like if it doesn't exist
    const like = await prisma.like.upsert({
      where: {
        startupId_userId: {
          startupId: params.id,
          userId: session.user.id,
        },
      },
      create: {
        startupId: params.id,
        userId: session.user.id,
      },
      update: {},
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error liking startup:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
