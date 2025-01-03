import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    id: 'user1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: 'user2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'user3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
];

const startups = [
  {
    name: 'EcoTrack',
    description: 'Building a sustainable future with IoT-powered environmental monitoring.',
    roles: ['Frontend Developer', 'IoT Engineer', 'UI/UX Designer'],
    requirements: {
      experience: '2+ years',
      skills: ['React', 'IoT Protocols', 'Data Visualization'],
    },
    createdBy: 'user1',
  },
  {
    name: 'HealthHub',
    description: 'AI-powered personal health assistant and medical record management.',
    roles: ['ML Engineer', 'Backend Developer', 'Mobile Developer'],
    requirements: {
      experience: '3+ years',
      skills: ['Python', 'TensorFlow', 'React Native'],
    },
    createdBy: 'user2',
  },
  {
    name: 'CodeMentor',
    description: 'Peer-to-peer programming mentorship platform.',
    roles: ['Full Stack Developer', 'DevOps Engineer'],
    requirements: {
      experience: '1+ years',
      skills: ['Node.js', 'React', 'AWS'],
    },
    createdBy: 'user3',
  },
  {
    name: 'SmartFinance',
    description: 'Blockchain-based decentralized finance solution.',
    roles: ['Blockchain Developer', 'Smart Contract Engineer'],
    requirements: {
      experience: '2+ years',
      skills: ['Solidity', 'Web3.js', 'DeFi'],
    },
    createdBy: 'user1',
  },
  {
    name: 'ArtifyAI',
    description: 'AI-powered digital art creation and NFT marketplace.',
    roles: ['AI Engineer', 'Frontend Developer', 'Smart Contract Developer'],
    requirements: {
      experience: '2+ years',
      skills: ['PyTorch', 'React', 'Ethereum'],
    },
    createdBy: 'user2',
  },
];

const studyGroups = [
  {
    name: 'React Masters',
    description: 'Advanced React patterns and performance optimization techniques.',
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
    createdBy: 'user1',
  },
  {
    name: 'Machine Learning Fundamentals',
    description: 'From basics to advanced ML concepts with hands-on projects.',
    type: 'project',
    level: ['beginner', 'intermediate'],
    roadmap: {
      weeks: [
        { topic: 'Python Basics', duration: '1 week' },
        { topic: 'Data Processing', duration: '2 weeks' },
        { topic: 'ML Algorithms', duration: '3 weeks' },
      ],
    },
    schedule: {
      meetingDay: 'Wednesday',
      meetingTime: '19:00',
      duration: '1.5 hours',
    },
    createdBy: 'user2',
  },
  {
    name: 'Competitive Programming',
    description: 'Practice algorithmic problem solving and coding competitions.',
    type: 'coding',
    level: ['intermediate', 'advanced'],
    roadmap: {
      weeks: [
        { topic: 'Data Structures', duration: '2 weeks' },
        { topic: 'Algorithms', duration: '2 weeks' },
        { topic: 'Contest Practice', duration: '2 weeks' },
      ],
    },
    schedule: {
      meetingDay: 'Saturday',
      meetingTime: '10:00',
      duration: '3 hours',
    },
    createdBy: 'user3',
  },
  {
    name: 'Web3 Development',
    description: 'Learn blockchain development and Web3 technologies.',
    type: 'project',
    level: ['intermediate'],
    roadmap: {
      weeks: [
        { topic: 'Blockchain Basics', duration: '1 week' },
        { topic: 'Smart Contracts', duration: '2 weeks' },
        { topic: 'DApp Development', duration: '3 weeks' },
      ],
    },
    schedule: {
      meetingDay: 'Thursday',
      meetingTime: '20:00',
      duration: '2 hours',
    },
    createdBy: 'user1',
  },
  {
    name: 'Mobile App Design',
    description: 'UI/UX design principles for mobile applications.',
    type: 'project',
    level: ['beginner', 'intermediate'],
    roadmap: {
      weeks: [
        { topic: 'Design Principles', duration: '1 week' },
        { topic: 'UI Components', duration: '2 weeks' },
        { topic: 'Prototyping', duration: '1 week' },
      ],
    },
    schedule: {
      meetingDay: 'Tuesday',
      meetingTime: '17:00',
      duration: '1.5 hours',
    },
    createdBy: 'user2',
  },
];

async function main() {
  // Clear existing data
  await prisma.studyGroupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Create startups
  for (const startup of startups) {
    await prisma.startup.create({
      data: startup,
    });
  }

  // Create study groups and add creators as members
  for (const group of studyGroups) {
    const { createdBy, ...groupData } = group;
    await prisma.studyGroup.create({
      data: {
        ...groupData,
        members: {
          create: {
            userId: createdBy,
            role: 'admin',
          },
        },
      },
    });
  }

  // Add some random members to study groups
  const allGroups = await prisma.studyGroup.findMany();
  for (const group of allGroups) {
    // Get all members of this group
    const existingMembers = await prisma.studyGroupMember.findMany({
      where: { studyGroupId: group.id },
      select: { userId: true },
    });
    const existingMemberIds = existingMembers.map(m => m.userId);

    // Filter out users who are already members
    const availableUsers = users.filter(user => !existingMemberIds.includes(user.id));
    const randomUsers = availableUsers.slice(0, Math.floor(Math.random() * 2) + 1);

    for (const user of randomUsers) {
      await prisma.studyGroupMember.create({
        data: {
          userId: user.id,
          studyGroupId: group.id,
          role: 'member',
        },
      });
    }
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
