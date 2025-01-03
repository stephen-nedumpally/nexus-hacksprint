import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

type StudyGroupWithCount = Awaited<ReturnType<typeof prisma.studyGroup.findFirst>> & {
  _count: {
    members: number;
  };
};

interface StudyGroupResponse extends Omit<StudyGroupWithCount, '_count'> {
  memberCount: number;
}

interface CreateStudyGroupData {
  name: string;
  description: string;
  type: string;
  level: string[];
  roadmap: {
    weeks: Array<{
      topic: string;
      duration: string;
    }>;
  };
  schedule: {
    meetingDay: string;
    meetingTime: string;
    duration: string;
  };
}

export async function GET() {
  try {
    const groups = await prisma.studyGroup.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const groupsWithMemberCount = groups.map((group: StudyGroupWithCount): StudyGroupResponse => ({
      ...group,
      memberCount: group._count.members,
      _count: undefined,
    }));

    return NextResponse.json(groupsWithMemberCount);
  } catch (error) {
    console.error('Error fetching study groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study groups' },
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

    const data: CreateStudyGroupData = await req.json();
    
    const group = await prisma.studyGroup.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        level: data.level,
        roadmap: data.roadmap,
        schedule: data.schedule,
        members: {
          create: {
            userId: session.user.id,
            role: 'admin',
          },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json({
      ...group,
      memberCount: group._count.members,
      _count: undefined,
    });
  } catch (error) {
    console.error('Error creating study group:', error);
    return NextResponse.json(
      { error: 'Failed to create study group' },
      { status: 500 }
    );
  }
}
