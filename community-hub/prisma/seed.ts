const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.dislike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.application.deleteMany();
  await prisma.requirements.deleteMany();
  await prisma.position.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Chen',
        email: 'alice@example.com',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Kumar',
        email: 'david@example.com',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        emailVerified: new Date(),
      },
    }),
  ]);

  // Create startups
  const startups = await Promise.all([
    // 1. TechFlow
    prisma.startup.create({
      data: {
        name: 'TechFlow',
        description: 'Revolutionizing workflow automation',
        domain: ['AI/ML', 'SaaS', 'Productivity'],
        website: 'https://techflow.example.com',
        problem: 'Manual workflows are time-consuming and error-prone',
        solution: 'AI-powered workflow automation platform',
        market: 'Global workflow automation market valued at $39.8B',
        traction: '50+ beta users, 90% retention rate',
        funding: 'Raised $500K pre-seed',
        teamSize: 8,
        founded: new Date('2024-06-15'),
        userId: users[0].id,
      },
    }),
    // 2. EcoTrack
    prisma.startup.create({
      data: {
        name: 'EcoTrack',
        description: 'Sustainable supply chain tracking',
        domain: ['Sustainability', 'Supply Chain', 'IoT'],
        website: 'https://ecotrack.example.com',
        problem: 'Lack of transparency in supply chain sustainability',
        solution: 'IoT-enabled supply chain tracking platform',
        market: 'Supply chain sustainability market growing at 20% CAGR',
        traction: '3 pilot customers, including Fortune 500',
        funding: 'Bootstrapped, revenue positive',
        teamSize: 5,
        founded: new Date('2024-03-01'),
        userId: users[1].id,
      },
    }),
    // 3. HealthAI
    prisma.startup.create({
      data: {
        name: 'HealthAI',
        description: 'AI-powered healthcare diagnostics',
        domain: ['Healthcare', 'AI/ML', 'DeepTech'],
        website: 'https://healthai.example.com',
        problem: 'Delayed and inaccurate medical diagnoses',
        solution: 'Deep learning models for medical image analysis',
        market: 'Healthcare AI market expected to reach $45B by 2026',
        traction: '2 hospital partnerships, 95% accuracy rate',
        funding: 'Raised $2M seed round',
        teamSize: 12,
        founded: new Date('2023-11-20'),
        userId: users[2].id,
      },
    }),
    // 4. EduTech
    prisma.startup.create({
      data: {
        name: 'EduTech',
        description: 'Personalized learning platform',
        domain: ['Education', 'AI/ML', 'EdTech'],
        website: 'https://edutech.example.com',
        problem: 'One-size-fits-all education system',
        solution: 'Adaptive learning platform with personalized paths',
        market: 'EdTech market size of $342B by 2025',
        traction: '10,000+ students, 85% improvement in scores',
        funding: 'Raised $1.5M seed round',
        teamSize: 15,
        founded: new Date('2023-09-10'),
        userId: users[3].id,
      },
    }),
    // 5. FinSec
    prisma.startup.create({
      data: {
        name: 'FinSec',
        description: 'AI-powered cybersecurity for fintech',
        domain: ['Cybersecurity', 'FinTech', 'AI/ML'],
        website: 'https://finsec.example.com',
        problem: 'Rising financial fraud and cyber threats',
        solution: 'Real-time threat detection using AI',
        market: 'FinTech security market at $12B CAGR 15%',
        traction: '5 bank partnerships, prevented $2M in fraud',
        funding: 'Raised $3M Series A',
        teamSize: 20,
        founded: new Date('2023-07-05'),
        userId: users[4].id,
      },
    }),
    // 6. AgriTech
    prisma.startup.create({
      data: {
        name: 'AgriTech',
        description: 'Smart farming solutions',
        domain: ['Agriculture', 'IoT', 'AI/ML'],
        website: 'https://agritech.example.com',
        problem: 'Low farm productivity and resource wastage',
        solution: 'IoT sensors and AI for precision farming',
        market: 'Smart farming market to reach $22B by 2025',
        traction: '1000+ farmers, 40% increase in yield',
        funding: 'Raised $750K seed round',
        teamSize: 6,
        founded: new Date('2024-01-01'),
        userId: users[5].id,
      },
    }),
  ]);

  // Create positions for each startup
  for (let i = 0; i < startups.length; i++) {
    const startup = startups[i];
    const positionsData = [
      {
        title: 'Senior Software Engineer',
        description: 'Lead backend development and architecture',
        startupId: startup.id,
        requirements: {
          create: {
            skills: ['Node.js', 'Python', 'AWS'],
            experience: 5,
            education: "Bachelor's in Computer Science",
          },
        },
      },
      {
        title: 'Product Manager',
        description: 'Drive product strategy and roadmap',
        startupId: startup.id,
        requirements: {
          create: {
            skills: ['Product Strategy', 'Agile', 'Data Analysis'],
            experience: 3,
            education: "Bachelor's in Business/Tech",
          },
        },
      },
    ];
    
    await Promise.all(
      positionsData.map(position => prisma.position.create({ data: position }))
    );
  }

  // Create likes, dislikes, and comments
  for (const startup of startups) {
    // Create likes
    await Promise.all(
      users.slice(0, 3).map(user =>
        prisma.like.create({
          data: {
            userId: user.id,
            startupId: startup.id,
          },
        })
      )
    );

    // Create dislikes
    await Promise.all(
      users.slice(3, 4).map(user =>
        prisma.dislike.create({
          data: {
            userId: user.id,
            startupId: startup.id,
          },
        })
      )
    );

    // Create comments with replies
    const comments = await Promise.all(
      users.slice(0, 2).map(user =>
        prisma.comment.create({
          data: {
            content: `Great startup! I love the ${startup.domain[0]} focus.`,
            userId: user.id,
            startupId: startup.id,
            createdAt: new Date(),
          },
        })
      )
    );

    // Add replies to comments
    for (const comment of comments) {
      await Promise.all(
        users.slice(2, 4).map(user =>
          prisma.comment.create({
            data: {
              content: `I agree! The ${startup.solution} is innovative.`,
              userId: user.id,
              startupId: startup.id,
              parentId: comment.id,
              createdAt: new Date(),
            },
          })
        )
      );
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
