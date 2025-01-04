import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const testUser1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      name: 'Test User 1',
      email: 'test1@example.com',
      verified: true,
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      name: 'Test User 2',
      email: 'test2@example.com',
      verified: true,
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
  });

  // Create startups
  const startup1 = await prisma.startup.upsert({
    where: { id: 'startup1' },
    update: {},
    create: {
      id: 'startup1',
      name: 'TechFlow',
      description: 'Building the future of workflow automation with AI',
      logo: 'https://picsum.photos/200',
      foundedYear: 2024,
      teamSize: 5,
      domain: ['AI/ML', 'SaaS', 'Productivity'],
      website: 'https://techflow.example.com',
      userId: testUser1.id,
      positions: {
        create: [
          {
            title: 'Senior Frontend Developer',
            description: 'Lead our frontend development efforts and shape our product UI/UX',
            requirements: {
              create: {
                skills: ['React', 'TypeScript', 'Next.js'],
                experience: 36,
                education: "Bachelor's in Computer Science or related field",
              },
            },
          },
          {
            title: 'ML Engineer',
            description: 'Develop and implement machine learning models for our automation platform',
            requirements: {
              create: {
                skills: ['Python', 'TensorFlow', 'PyTorch'],
                experience: 24,
                education: "Master's in Machine Learning or related field",
              },
            },
          },
        ],
      },
    },
  });

  const startup2 = await prisma.startup.upsert({
    where: { id: 'startup2' },
    update: {},
    create: {
      id: 'startup2',
      name: 'GreenEarth Solutions',
      description: 'Revolutionizing sustainability through innovative technology',
      logo: 'https://picsum.photos/201',
      foundedYear: 2023,
      teamSize: 8,
      domain: ['CleanTech', 'IoT', 'Sustainability'],
      website: 'https://greenearth.example.com',
      userId: testUser2.id,
      positions: {
        create: [
          {
            title: 'IoT Developer',
            description: 'Develop IoT solutions for environmental monitoring',
            requirements: {
              create: {
                skills: ['Arduino', 'Raspberry Pi', 'C++'],
                experience: 24,
                education: "Bachelor's in Electronics or Computer Engineering",
              },
            },
          },
        ],
      },
    },
  });

  // Add some reactions and comments
  await prisma.startupReaction.createMany({
    data: [
      {
        startupId: startup1.id,
        userId: testUser2.id,
        type: 'like',
      },
      {
        startupId: startup2.id,
        userId: testUser1.id,
        type: 'like',
      },
    ],
  });

  await prisma.startupComment.createMany({
    data: [
      {
        startupId: startup1.id,
        userId: testUser2.id,
        content: 'Amazing idea! The AI workflow automation space is really heating up.',
      },
      {
        startupId: startup2.id,
        userId: testUser1.id,
        content: 'Love the focus on sustainability. Would love to learn more about your IoT implementation.',
      },
    ],
  });

  // Create study groups
  const studyGroup1 = await prisma.studyGroup.create({
    data: {
      name: 'Advanced React Patterns',
      description: 'Deep dive into React design patterns and performance optimization',
      type: 'coding',
      level: ['intermediate', 'advanced'],
      roadmap: {
        weeks: [
          { topic: 'Advanced Hooks', duration: '1 week' },
          { topic: 'Performance Optimization', duration: '1 week' },
          { topic: 'State Management', duration: '2 weeks' },
        ],
      },
      schedule: {
        meetingDay: 'Monday',
        meetingTime: '18:00',
        duration: '2 hours',
      },
      members: {
        create: [
          {
            userId: testUser1.id,
            role: 'LEADER',
          },
          {
            userId: testUser2.id,
            role: 'MEMBER',
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
