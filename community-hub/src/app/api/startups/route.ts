import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startups' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    const startup = await prisma.startup.create({
      data: {
        name: data.name,
        description: data.description,
        roles: data.roles,
        requirements: data.requirements,
        createdBy: session.user.id,
      },
    });
    
    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Failed to create startup' },
      { status: 500 }
    );
  }
}
