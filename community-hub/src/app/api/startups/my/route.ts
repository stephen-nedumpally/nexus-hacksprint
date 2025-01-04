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
        },
        likes: true,
        dislikes: true,
        comments: true,
      },
    });

    if (!startup) {
      return NextResponse.json(null);
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error fetching startup:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
