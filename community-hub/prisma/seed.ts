const { PrismaClient } = require('@prisma/client');

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
    foundedYear: 2023,
    teamSize: 5,
    domain: ['IoT', 'Environmental Tech', 'Cloud Computing'],
    website: 'https://ecotrack.example.com',
    positions: [
      {
        title: 'Frontend Developer',
        description: 'Build responsive and intuitive user interfaces for our IoT dashboard.',
        requirements: {
          skills: ['React', 'TypeScript', 'D3.js'],
          experience: 24, // months
          education: "Bachelor's in Computer Science or related field",
        },
      },
      {
        title: 'IoT Engineer',
        description: 'Design and implement IoT sensor networks and data collection systems.',
        requirements: {
          skills: ['Arduino', 'MQTT', 'Python', 'AWS IoT'],
          experience: 36,
          education: "Master's in Electronics or Computer Engineering",
        },
      },
    ],
  },
  {
    name: 'HealthHub',
    description: 'AI-powered personal health assistant and medical record management.',
    foundedYear: 2022,
    teamSize: 8,
    domain: ['HealthTech', 'AI/ML', 'Mobile Development'],
    website: 'https://healthhub.example.com',
    positions: [
      {
        title: 'ML Engineer',
        description: 'Develop and optimize machine learning models for health predictions.',
        requirements: {
          skills: ['Python', 'TensorFlow', 'PyTorch', 'Healthcare ML'],
          experience: 36,
          education: "Master's in Machine Learning or related field",
        },
      },
      {
        title: 'Mobile Developer',
        description: 'Create native mobile applications for iOS and Android platforms.',
        requirements: {
          skills: ['React Native', 'TypeScript', 'Mobile UI/UX'],
          experience: 24,
          education: "Bachelor's in Computer Science",
        },
      },
    ],
  },
  {
    name: 'CodeMentor',
    description: 'Peer-to-peer programming mentorship platform.',
    foundedYear: 2024,
    teamSize: 3,
    domain: ['EdTech', 'Web Development'],
    website: 'https://codementor.example.com',
    positions: [
      {
        title: 'Full Stack Developer',
        description: 'Build and maintain our mentorship platform using modern web technologies.',
        requirements: {
          skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
          experience: 12,
          education: "Bachelor's in Computer Science or equivalent experience",
        },
      },
    ],
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
    members: {
      create: {
        userId: 'user1',
        role: 'admin',
      },
    },
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
    members: {
      create: {
        userId: 'user2',
        role: 'admin',
      },
    },
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
    members: {
      create: {
        userId: 'user3',
        role: 'admin',
      },
    },
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
    members: {
      create: {
        userId: 'user1',
        role: 'admin',
      },
    },
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
    members: {
      create: {
        userId: 'user2',
        role: 'admin',
      },
    },
  },
];

async function main() {
  // Delete existing data
  await prisma.application.deleteMany();
  await prisma.requirements.deleteMany();
  await prisma.position.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.studyGroupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  // Create startups with positions and requirements
  for (const startup of startups) {
    await prisma.startup.create({
      data: {
        name: startup.name,
        description: startup.description,
        foundedYear: startup.foundedYear,
        teamSize: startup.teamSize,
        domain: startup.domain,
        website: startup.website,
        positions: {
          create: startup.positions.map((position) => ({
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
    });
  }

  // Create study groups
  for (const group of studyGroups) {
    await prisma.studyGroup.create({
      data: {
        name: group.name,
        description: group.description,
        type: group.type,
        level: group.level,
        roadmap: group.roadmap,
        schedule: group.schedule,
        members: group.members,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
