const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.requirements.deleteMany();
  await prisma.position.deleteMany();
  await prisma.startup.deleteMany();

  const startups = [
    {
      name: 'EduTech AI',
      description: 'Revolutionizing education through personalized AI-powered learning experiences.',
      logo: null,
      foundedYear: 2023,
      teamSize: 5,
      domain: ['AI/ML', 'EdTech'],
      website: 'https://edutechai.example.com',
      problemStatement: 'Traditional one-size-fits-all education fails to address individual student needs, leading to poor engagement and learning outcomes.',
      solution: 'AI-powered adaptive learning platform that creates personalized learning paths and provides real-time feedback based on student performance.',
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'AWS'],
      tam: 342000, // $342B
      sam: 15000,  // $15B
      competitors: 8,
      mrr: 25000,
      stage: 'Growth',
      fundingRound: 'Seed',
      fundingRaised: 2.5,
      traction: '10,000+ active students, 85% improvement in learning outcomes',
      positions: [
        {
          title: 'Senior ML Engineer',
          description: 'Lead the development of our core AI learning algorithms.',
          requirements: {
            create: {
              skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
              experience: 5,
              education: 'MS/PhD in Computer Science or related field',
            },
          },
        },
      ],
    },
    {
      name: 'HealthSync',
      description: 'AI-powered health monitoring and predictive analytics platform.',
      logo: null,
      foundedYear: 2024,
      teamSize: 8,
      domain: ['HealthTech', 'AI/ML'],
      website: 'https://healthsync.example.com',
      problemStatement: 'Lack of continuous health monitoring and early warning systems leads to delayed medical interventions.',
      solution: 'Wearable device and AI platform that continuously monitors vital signs and predicts potential health issues before they become serious.',
      techStack: ['Flutter', 'Python', 'TensorFlow', 'AWS', 'MongoDB'],
      tam: 245000, // $245B
      sam: 12000,  // $12B
      competitors: 5,
      mrr: 75000,
      stage: 'MVP',
      fundingRound: 'Pre-seed',
      fundingRaised: 0.8,
      traction: '500 beta users, 3 hospital partnerships',
      positions: [
        {
          title: 'Mobile Developer',
          description: 'Build and maintain our Flutter-based mobile application.',
          requirements: {
            create: {
              skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
              experience: 3,
              education: 'BS in Computer Science or equivalent',
            },
          },
        },
      ],
    },
    {
      name: 'CarbonZero',
      description: 'Helping businesses track and reduce their carbon footprint using IoT and AI.',
      logo: null,
      foundedYear: 2023,
      teamSize: 12,
      domain: ['IoT', 'AI/ML', 'Sustainability'],
      website: 'https://carbonzero.example.com',
      problemStatement: 'Companies struggle to accurately measure and effectively reduce their carbon emissions.',
      solution: 'IoT sensors and AI platform that provides real-time carbon emission monitoring and automated optimization suggestions.',
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'AWS IoT'],
      tam: 180000, // $180B
      sam: 8000,   // $8B
      competitors: 6,
      mrr: 150000,
      stage: 'Scale',
      fundingRound: 'Series A',
      fundingRaised: 12.5,
      traction: '50+ enterprise clients, reducing emissions by 25% on average',
      positions: [
        {
          title: 'IoT Systems Engineer',
          description: 'Design and implement IoT sensor networks and data collection systems.',
          requirements: {
            create: {
              skills: ['IoT Protocols', 'Embedded Systems', 'C++', 'Python'],
              experience: 4,
              education: 'BS/MS in Electrical Engineering or Computer Science',
            },
          },
        },
      ],
    },
    {
      name: 'FinLit',
      description: 'Making financial literacy accessible to everyone through gamified learning.',
      logo: null,
      foundedYear: 2024,
      teamSize: 6,
      domain: ['FinTech', 'EdTech'],
      website: 'https://finlit.example.com',
      problemStatement: 'Lack of engaging financial education leads to poor financial decisions and literacy gaps.',
      solution: 'Gamified financial education platform with real-world simulations and personalized learning paths.',
      techStack: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
      tam: 95000,  // $95B
      sam: 4000,   // $4B
      competitors: 12,
      mrr: 35000,
      stage: 'Growth',
      fundingRound: 'Seed',
      fundingRaised: 1.8,
      traction: '50,000 active users, 92% user satisfaction rate',
      positions: [
        {
          title: 'Full Stack Developer',
          description: 'Build and maintain our web and mobile applications.',
          requirements: {
            create: {
              skills: ['React Native', 'Node.js', 'MongoDB', 'TypeScript'],
              experience: 3,
              education: 'BS in Computer Science or equivalent',
            },
          },
        },
      ],
    },
    {
      name: 'AgriTech Solutions',
      description: 'Empowering farmers with data-driven agriculture solutions.',
      logo: null,
      foundedYear: 2023,
      teamSize: 15,
      domain: ['AgTech', 'IoT', 'AI/ML'],
      website: 'https://agritech.example.com',
      problemStatement: 'Small-scale farmers lack access to modern agricultural technology and data-driven insights.',
      solution: 'Affordable IoT sensors and AI platform providing crop monitoring, weather predictions, and farming recommendations.',
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'AWS IoT'],
      tam: 125000, // $125B
      sam: 6000,   // $6B
      competitors: 4,
      mrr: 200000,
      stage: 'Scale',
      fundingRound: 'Series A',
      fundingRaised: 15.0,
      traction: '10,000+ farmers, 40% increase in crop yields',
      positions: [
        {
          title: 'Data Scientist',
          description: 'Develop and improve our agricultural prediction models.',
          requirements: {
            create: {
              skills: ['Python', 'Machine Learning', 'Agricultural Data Analysis'],
              experience: 4,
              education: 'MS/PhD in Data Science or Agricultural Engineering',
            },
          },
        },
      ],
    },
  ];

  for (const startup of startups) {
    await prisma.startup.create({
      data: {
        ...startup,
        positions: {
          create: startup.positions.map((position: any) => ({
            ...position,
          })),
        },
      },
    });
  }

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
