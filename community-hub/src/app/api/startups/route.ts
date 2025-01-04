import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        positions: {
          include: {
            requirements: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const startup = await prisma.startup.create({
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
        foundedYear: data.foundedYear,
        teamSize: data.teamSize,
        domain: data.domain,
        website: data.website,
        problemStatement: data.problemStatement,
        solution: data.solution,
        techStack: data.techStack,
        tam: data.tam,
        sam: data.sam,
        competitors: data.competitors,
        mrr: data.mrr,
        stage: data.stage,
        fundingRound: data.fundingRound,
        fundingRaised: data.fundingRaised,
        traction: data.traction,
        positions: {
          create: data.positions.map((position: any) => ({
            title: position.title,
            description: position.description,
            requirements: {
              create: {
                skills: position.requirements.skills,
                experience: position.requirements.experience,
                education: position.requirements.education,
              },
            },
          })),
        },
      },
      include: {
        positions: {
          include: {
            requirements: true,
          },
        },
      },
    });

    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
