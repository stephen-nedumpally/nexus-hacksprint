import { prisma } from '@/lib/prisma';
import type { Startup } from '@/types/startup';

export async function fetchStartups(): Promise<Startup[]> {
  return await prisma.startup.findMany({
    include: {
      positions: {
        include: {
          requirements: true,
        },
      },
    },
  });
}

interface CreateStartupInput {
  name: string;
  description: string;
  logo?: string;
  foundedYear: number;
  teamSize: number;
  domain: string[];
  website?: string;
  positions: {
    title: string;
    description: string;
    requirements: {
      skills: string[];
      experience: number;
      education?: string;
    };
  }[];
}

export async function createStartup(data: CreateStartupInput): Promise<Startup> {
  return await prisma.startup.create({
    data: {
      ...data,
      positions: {
        create: data.positions.map((position) => ({
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
}

export async function applyToPosition(positionId: string): Promise<void> {
  // Get the current user from the session
  const userId = 'current-user-id'; // Replace with actual session user ID

  await prisma.application.create({
    data: {
      positionId,
      userId,
    },
  });
}

export async function getApplicationStatus(positionId: string): Promise<string | null> {
  // Get the current user from the session
  const userId = 'current-user-id'; // Replace with actual session user ID

  const application = await prisma.application.findUnique({
    where: {
      positionId_userId: {
        positionId,
        userId,
      },
    },
  });

  return application?.status || null;
}
