import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { startupId, positionId } = body;

    if (!startupId || !positionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Create application with all required checks in a transaction
      const application = await prisma.$transaction(async (tx) => {
        // Check if position exists and belongs to startup
        const position = await tx.position.findFirst({
          where: { 
            id: positionId,
            startupId: startupId
          }
        });

        if (!position) {
          throw new Error('Position not found or does not belong to this startup');
        }

        // Check for existing application
        const existing = await tx.application.findUnique({
          where: {
            positionId_userId: {
              positionId: positionId,
              userId: user.id
            }
          }
        });

        if (existing) {
          throw new Error('You have already applied for this position');
        }

        // Create the application
        return await tx.application.create({
          data: {
            startupId: startupId,
            positionId: positionId,
            userId: user.id,
          }
        });
      });

      return NextResponse.json({ data: application });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('[APPLICATIONS_POST]', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
