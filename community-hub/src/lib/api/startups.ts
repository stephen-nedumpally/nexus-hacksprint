import { prisma } from '@/lib/prisma';
import type { Startup } from '@/types/startup';

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

export async function getMyStartup(): Promise<Startup | null> {
  // Get the current user from the session
  const userId = 'current-user-id'; // Replace with actual session user ID

  return await prisma.startup.findFirst({
    where: {
      userId,
    },
    include: {
      positions: {
        include: {
          requirements: true,
          applications: {
            include: {
              user: true,
            },
          },
        },
      },
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

export async function createPosition(startupId: string, data: {
  title: string;
  description: string;
  requirements: {
    skills: string[];
    experience: number;
    education?: string;
  };
}): Promise<void> {
  await prisma.position.create({
    data: {
      startupId,
      title: data.title,
      description: data.description,
      requirements: {
        create: {
          skills: data.requirements.skills,
          experience: data.requirements.experience,
          education: data.requirements.education,
        },
      },
    },
  });
}

export async function addReaction(startupId: string, type: 'like' | 'dislike'): Promise<void> {
  // Get the current user from the session
  const userId = 'current-user-id'; // Replace with actual session user ID

  await prisma.startupReaction.upsert({
    where: {
      startupId_userId: {
        startupId,
        userId,
      },
    },
    update: {
      type,
    },
    create: {
      startupId,
      userId,
      type,
    },
  });
}

export async function addComment(startupId: string, content: string): Promise<void> {
  // Get the current user from the session
  const userId = 'current-user-id'; // Replace with actual session user ID

  await prisma.startupComment.create({
    data: {
      startupId,
      userId,
      content,
    },
  });
}

import prisma from '@/lib/prisma';

export async function fetchStartups() {
  try {
    const response = await fetch('/api/startups');
    if (!response.ok) throw new Error('Failed to fetch startups');
    return response.json();
  } catch (error) {
    console.error('Error fetching startups:', error);
    throw error;
  }
}

export async function fetchMyApplications() {
  try {
    const response = await fetch('/api/startups/applications');
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function applyToPosition(positionId: string) {
  try {
    const response = await fetch('/api/startups/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positionId }),
    });
    if (!response.ok) throw new Error('Failed to apply');
    return response.json();
  } catch (error) {
    console.error('Error applying to position:', error);
    throw error;
  }
}
