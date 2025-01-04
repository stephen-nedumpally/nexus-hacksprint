import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { handSignVerified, survey, selectedSkills, assessmentResults } = data;

    // Update user verification status and store survey results
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        verified: true,
        skillTests: {
          create: {
            skills: selectedSkills,
            scores: assessmentResults,
            nextTestAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error completing verification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
