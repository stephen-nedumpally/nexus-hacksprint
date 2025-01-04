import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const startup = await prisma.startup.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        positions: {
          include: {
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
        },
        likes: true,
        dislikes: true,
        comments: {
          include: {
            user: true
          }
        },
        user: true,
      },
    });

    // Return an empty object if no startup found
    return NextResponse.json(startup || { notFound: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching startup:', error.message);
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
