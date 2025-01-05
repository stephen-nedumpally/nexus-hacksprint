const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.dislike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.application.deleteMany();
  await prisma.position.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Chen',
        email: 'alice@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Kumar',
        email: 'david@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        verified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
    }),
  ]);

  // Create startups with positions
  const startups = await Promise.all([
    // 1. NexusAI - AI Infrastructure Platform
    prisma.startup.create({
      data: {
        name: 'NexusAI',
        description: 'Democratizing AI infrastructure for enterprises',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=NexusAI',
        domain: ['AI/ML', 'Cloud Infrastructure', 'Enterprise Software'],
        website: 'https://nexusai.example.com',
        problem: 'Enterprises struggle with AI infrastructure costs and complexity',
        solution: 'Unified AI infrastructure platform with automated scaling and optimization',
        market: '$50B AI infrastructure market growing at 35% CAGR',
        traction: '15 enterprise customers including 2 Fortune 500 companies',
        funding: 'Raised $4.5M seed round led by Sequoia',
        teamSize: 12,
        foundedYear: 2024,
        userId: users[0].id,
        positions: {
          create: [
            {
              title: 'Senior ML Platform Engineer',
              description: 'Build and scale our AI infrastructure platform',
              type: 'FULL_TIME',
              location: 'San Francisco / Remote',
              requirements: ['Python', 'Kubernetes', 'TensorFlow', 'PyTorch', 'AWS'],
              responsibilities: 'Design and implement scalable ML infrastructure, optimize model deployment pipelines, collaborate with ML teams',
              qualifications: 'MS/PhD in Computer Science, 5+ years experience with ML infrastructure',
              equity: '0.5% - 1%',
              stipend: '$150,000 - $220,000/year',
            },
            {
              title: 'Product Manager - Enterprise',
              description: 'Drive enterprise product strategy and growth',
              type: 'FULL_TIME',
              location: 'San Francisco',
              requirements: ['Enterprise Software', 'Product Strategy', 'AI/ML', 'GTM'],
              responsibilities: 'Define product vision, work with enterprise customers, drive roadmap',
              qualifications: '5+ years PM experience in enterprise software',
              equity: '0.3% - 0.7%',
              stipend: '$140,000 - $180,000/year',
            },
          ],
        },
      },
    }),

    // 2. GreenChain - Climate Tech
    prisma.startup.create({
      data: {
        name: 'GreenChain',
        description: 'Blockchain-based carbon credit trading platform',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=GreenChain',
        domain: ['CleanTech', 'Blockchain', 'Sustainability'],
        website: 'https://greenchain.example.com',
        problem: 'Carbon credit market lacks transparency and efficiency',
        solution: 'Decentralized carbon credit verification and trading platform',
        market: 'Carbon credit market to reach $100B by 2030',
        traction: '100,000 carbon credits traded, partnerships with 3 governments',
        funding: 'Raised $2.5M pre-seed from climate tech VCs',
        teamSize: 8,
        foundedYear: 2024,
        userId: users[1].id,
        positions: {
          create: [
            {
              title: 'Blockchain Developer',
              description: 'Build our carbon credit smart contracts and protocols',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts'],
              responsibilities: 'Develop and audit smart contracts, implement carbon credit protocols',
              qualifications: '3+ years blockchain development experience',
              equity: '0.8% - 1.2%',
              stipend: '$130,000 - $180,000/year',
            },
            {
              title: 'Climate Science Researcher',
              description: 'Lead carbon credit verification methodology',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['Climate Science', 'Carbon Markets', 'Research'],
              responsibilities: 'Develop carbon credit verification standards, work with partners',
              qualifications: 'PhD in Environmental Science or related field',
              equity: '0.5% - 1%',
              stipend: '$120,000 - $160,000/year',
            },
          ],
        },
      },
    }),

    // 3. BioSync - Healthcare AI
    prisma.startup.create({
      data: {
        name: 'BioSync',
        description: 'AI-powered drug discovery platform',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BioSync',
        domain: ['BioTech', 'AI/ML', 'Healthcare'],
        website: 'https://biosync.example.com',
        problem: 'Drug discovery is slow, expensive, and has high failure rates',
        solution: 'AI platform to predict drug efficacy and optimize clinical trials',
        market: '$200B drug discovery market',
        traction: '2 pharma partnerships, 1 drug in pre-clinical trials',
        funding: 'Raised $8M Series A',
        teamSize: 15,
        foundedYear: 2023,
        userId: users[2].id,
        positions: {
          create: [
            {
              title: 'Senior ML Engineer - Drug Discovery',
              description: 'Build ML models for drug discovery',
              type: 'FULL_TIME',
              location: 'Boston',
              requirements: ['Python', 'PyTorch', 'Computational Chemistry', 'Biology'],
              responsibilities: 'Develop ML models for drug discovery, work with biology team',
              qualifications: 'PhD in Computational Biology or related field',
              equity: '0.3% - 0.8%',
              stipend: '$160,000 - $220,000/year',
            },
            {
              title: 'Computational Chemist',
              description: 'Lead molecular modeling and simulation',
              type: 'FULL_TIME',
              location: 'Boston',
              requirements: ['Molecular Modeling', 'Drug Design', 'Python'],
              responsibilities: 'Design and validate molecular models, analyze drug candidates',
              qualifications: 'PhD in Chemistry or related field',
              equity: '0.3% - 0.7%',
              stipend: '$140,000 - $190,000/year',
            },
          ],
        },
      },
    }),

    // 4. CyberMind - EdTech
    prisma.startup.create({
      data: {
        name: 'CyberMind',
        description: 'AI tutor for personalized learning',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberMind',
        domain: ['EdTech', 'AI/ML', 'Consumer Tech'],
        website: 'https://cybermind.example.com',
        problem: 'Students lack personalized attention and guidance',
        solution: 'AI-powered personal tutor that adapts to each student',
        market: '$350B global EdTech market',
        traction: '50,000 active users, 92% improvement in test scores',
        funding: 'Raised $3M seed round',
        teamSize: 10,
        foundedYear: 2024,
        userId: users[3].id,
        positions: {
          create: [
            {
              title: 'NLP Engineer',
              description: 'Build conversational AI for education',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['NLP', 'Python', 'Transformers', 'LLMs'],
              responsibilities: 'Develop conversational AI models, improve tutoring system',
              qualifications: 'MS/PhD in CS/ML, experience with LLMs',
              equity: '0.5% - 1%',
              stipend: '$130,000 - $180,000/year',
            },
            {
              title: 'Education Content Specialist',
              description: 'Create and curate educational content',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['Curriculum Development', 'Education', 'Content Creation'],
              responsibilities: 'Develop learning content, work with AI team',
              qualifications: "Master's in Education, 5+ years teaching experience",
              equity: '0.3% - 0.6%',
              stipend: '$90,000 - $120,000/year',
            },
          ],
        },
      },
    }),

    // 5. QuantumLeap - Quantum Computing
    prisma.startup.create({
      data: {
        name: 'QuantumLeap',
        description: 'Quantum computing software development kit',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=QuantumLeap',
        domain: ['Quantum Computing', 'Developer Tools', 'DeepTech'],
        website: 'https://quantumleap.example.com',
        problem: 'Quantum computing is inaccessible to most developers',
        solution: 'Easy-to-use SDK for quantum algorithm development',
        market: '$10B quantum computing software market by 2030',
        traction: '5,000 developers, partnership with IBM Quantum',
        funding: 'Raised $5M seed round',
        teamSize: 8,
        foundedYear: 2024,
        userId: users[4].id,
        positions: {
          create: [
            {
              title: 'Quantum Software Engineer',
              description: 'Build quantum computing SDK',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['Quantum Computing', 'Python', 'Qiskit', 'Linear Algebra'],
              responsibilities: 'Develop quantum algorithms, improve SDK',
              qualifications: 'PhD in Physics/CS, quantum computing experience',
              equity: '1% - 2%',
              stipend: '$150,000 - $200,000/year',
            },
            {
              title: 'Developer Advocate',
              description: 'Help developers adopt quantum computing',
              type: 'FULL_TIME',
              location: 'Remote',
              requirements: ['Developer Relations', 'Technical Writing', 'Public Speaking'],
              responsibilities: 'Create content, give talks, support community',
              qualifications: 'Strong technical background, excellent communication',
              equity: '0.5% - 1%',
              stipend: '$120,000 - $160,000/year',
            },
          ],
        },
      },
    }),

    // 6. RoboFarm - AgTech
    prisma.startup.create({
      data: {
        name: 'RoboFarm',
        description: 'Autonomous farming robots',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RoboFarm',
        domain: ['Robotics', 'Agriculture', 'AI/ML'],
        website: 'https://robofarm.example.com',
        problem: 'Labor shortage and inefficiency in agriculture',
        solution: 'Autonomous robots for planting, monitoring, and harvesting',
        market: '$30B agricultural robotics market',
        traction: '10 robots deployed, 300% increase in efficiency',
        funding: 'Raised $6M seed round',
        teamSize: 12,
        foundedYear: 2023,
        userId: users[5].id,
        positions: {
          create: [
            {
              title: 'Robotics Engineer',
              description: 'Design and build agricultural robots',
              type: 'FULL_TIME',
              location: 'Sacramento',
              requirements: ['Robotics', 'ROS', 'Computer Vision', 'C++'],
              responsibilities: 'Develop robot control systems, implement navigation',
              qualifications: "Master's in Robotics/ME, 3+ years experience",
              equity: '0.7% - 1.2%',
              stipend: '$140,000 - $190,000/year',
            },
            {
              title: 'Agricultural Scientist',
              description: 'Lead crop science and automation strategy',
              type: 'FULL_TIME',
              location: 'Sacramento',
              requirements: ['Agriculture', 'Crop Science', 'Automation'],
              responsibilities: 'Define farming protocols, optimize automation',
              qualifications: 'PhD in Agricultural Science',
              equity: '0.5% - 1%',
              stipend: '$110,000 - $150,000/year',
            },
          ],
        },
      },
    }),
  ]);

  // Add likes, dislikes, and comments
  const interactions = [];
  
  for (const startup of startups) {
    // Add random likes
    for (const user of users) {
      if (Math.random() > 0.5) {
        interactions.push(
          prisma.like.create({
            data: {
              startupId: startup.id,
              userId: user.id,
            },
          })
        );
      } else if (Math.random() > 0.7) {
        interactions.push(
          prisma.dislike.create({
            data: {
              startupId: startup.id,
              userId: user.id,
            },
          })
        );
      }
    }

    // Add comments
    const comments = [
      {
        content: "Really innovative solution! I'd love to see how this scales.",
        userId: users[0].id,
      },
      {
        content: "The market opportunity is huge. Have you considered expanding to international markets?",
        userId: users[1].id,
      },
      {
        content: "Impressive traction! Would love to connect and learn more about your journey.",
        userId: users[2].id,
      },
      {
        content: "The technology stack looks solid. What's your approach to handling scalability?",
        userId: users[3].id,
      },
      {
        content: "Great team background! The combination of expertise is perfect for this problem.",
        userId: users[4].id,
      },
      {
        content: "The compensation packages are very competitive. Shows you value talent!",
        userId: users[5].id,
      },
    ];

    // Add random comments to each startup
    for (const comment of comments) {
      if (Math.random() > 0.3) {
        interactions.push(
          prisma.comment.create({
            data: {
              content: comment.content,
              startupId: startup.id,
              userId: comment.userId,
            },
          })
        );
      }
    }

    // Add some replies to comments
    const replies = [
      "Thanks for the feedback! We're working on it.",
      "Great point! Would love to discuss more.",
      "Absolutely! That's a key focus for us.",
      "Thanks for the kind words!",
    ];

    // Add random replies
    for (let i = 0; i < 2; i++) {
      if (Math.random() > 0.5) {
        interactions.push(
          prisma.comment.create({
            data: {
              content: replies[Math.floor(Math.random() * replies.length)],
              startupId: startup.id,
              userId: users[Math.floor(Math.random() * users.length)].id,
              parentId: (await prisma.comment.findFirst({
                where: { startupId: startup.id },
                select: { id: true },
              }))?.id,
            },
          })
        );
      }
    }
  }

  // Execute all interactions
  await Promise.all(interactions);

  // Create organizations (IITs) and their departments/courses
  console.log('Seeding organizations and courses...');

  // 1. IIT Madras
  const iitm = await prisma.organization.create({
    data: {
      name: 'IIT Madras',
      code: 'IITM',
      departments: {
        create: {
          name: 'BSc Data Science and Programming',
          code: 'BSC-DS',
          courses: {
            create: [
              // Foundation Level
              {
                name: 'Mathematics for Data Science 1',
                code: 'MDS1',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/mds1',
                discordLink: 'https://discord.gg/mds1',
              },
              {
                name: 'Statistics for Data Science 1',
                code: 'SDS1',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/sds1',
                discordLink: 'https://discord.gg/sds1',
              },
              {
                name: 'Python for Data Science',
                code: 'PDS',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/pds',
                discordLink: 'https://discord.gg/pds',
              },
              {
                name: 'Computational Thinking',
                code: 'CT',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/ct',
                discordLink: 'https://discord.gg/ct',
              },

              // Diploma Level
              {
                name: 'Machine Learning Foundations',
                code: 'MLF',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/mlf',
                discordLink: 'https://discord.gg/mlf',
              },
              {
                name: 'Machine Learning Techniques',
                code: 'MLT',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/mlt',
                discordLink: 'https://discord.gg/mlt',
              },
              {
                name: 'Business Data Management',
                code: 'BDM',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/bdm',
                discordLink: 'https://discord.gg/bdm',
              },
              {
                name: 'Data Visualization',
                code: 'DV',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/dv',
                discordLink: 'https://discord.gg/dv',
              },

              // Degree Level
              {
                name: 'Deep Learning',
                code: 'DL',
                level: 'DEGREE',
                whatsappLink: 'https://chat.whatsapp.com/dl',
                discordLink: 'https://discord.gg/dl',
              },
              {
                name: 'Natural Language Processing',
                code: 'NLP',
                level: 'DEGREE',
                whatsappLink: 'https://chat.whatsapp.com/nlp',
                discordLink: 'https://discord.gg/nlp',
              },
              {
                name: 'Computer Vision',
                code: 'CV',
                level: 'DEGREE',
                whatsappLink: 'https://chat.whatsapp.com/cv',
                discordLink: 'https://discord.gg/cv',
              },
              {
                name: 'Reinforcement Learning',
                code: 'RL',
                level: 'DEGREE',
                whatsappLink: 'https://chat.whatsapp.com/rl',
                discordLink: 'https://discord.gg/rl',
              },
            ],
          },
        },
      },
    },
  });

  // 2. IIT Bombay
  const iitb = await prisma.organization.create({
    data: {
      name: 'IIT Bombay',
      code: 'IITB',
      departments: {
        create: {
          name: 'BSc Programming and Data Science',
          code: 'BSC-PDS',
          courses: {
            create: [
              {
                name: 'Programming Fundamentals',
                code: 'PF',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/pf',
                discordLink: 'https://discord.gg/pf',
              },
              {
                name: 'Data Structures',
                code: 'DS',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/ds',
                discordLink: 'https://discord.gg/ds',
              },
              {
                name: 'Database Systems',
                code: 'DBS',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/dbs',
                discordLink: 'https://discord.gg/dbs',
              },
            ],
          },
        },
      },
    },
  });

  // 3. IIT Delhi
  const iitd = await prisma.organization.create({
    data: {
      name: 'IIT Delhi',
      code: 'IITD',
      departments: {
        create: {
          name: 'BSc Artificial Intelligence',
          code: 'BSC-AI',
          courses: {
            create: [
              {
                name: 'AI Fundamentals',
                code: 'AIF',
                level: 'FOUNDATION',
                whatsappLink: 'https://chat.whatsapp.com/aif',
                discordLink: 'https://discord.gg/aif',
              },
              {
                name: 'Neural Networks',
                code: 'NN',
                level: 'DIPLOMA',
                whatsappLink: 'https://chat.whatsapp.com/nn',
                discordLink: 'https://discord.gg/nn',
              },
              {
                name: 'AI Ethics',
                code: 'AIE',
                level: 'DEGREE',
                whatsappLink: 'https://chat.whatsapp.com/aie',
                discordLink: 'https://discord.gg/aie',
              },
            ],
          },
        },
      },
    },
  });

  // Create some course enrollments for test users
  console.log('Creating course enrollments...');

  // Create profiles for users first
  const userProfiles = await Promise.all(
    users.map(async (user, index) => {
      return prisma.profile.create({
        data: {
          userId: user.id,
          source: ['Search Engine', 'Friend Referral', 'Social Media'][index % 3],
          education: index % 2 === 0 ? "Bachelor's Degree" : "Master's Degree",
          status: index % 2 === 0 ? 'Student' : 'Employed',
          advancedSkills: ['Python', 'JavaScript', 'Java'].slice(0, 2),
          intermediateSkills: ['React', 'Node.js', 'PostgreSQL'].slice(0, 2),
          beginnerSkills: ['Docker', 'AWS', 'Kubernetes'].slice(0, 2),
          linkedinUrl: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '')}`,
          githubUrl: `https://github.com/${user.name.toLowerCase().replace(' ', '')}`,
        },
      });
    })
  );

  // Enroll users in various courses
  const iitmDept = await prisma.department.findFirst({
    where: { code: 'BSC-DS' },
    include: { courses: true },
  });

  const iitbDept = await prisma.department.findFirst({
    where: { code: 'BSC-PDS' },
    include: { courses: true },
  });

  const iitdDept = await prisma.department.findFirst({
    where: { code: 'BSC-AI' },
    include: { courses: true },
  });

  // Enroll users in different departments and courses
  await Promise.all([
    // User 1 in IITM
    prisma.profile.update({
      where: { id: userProfiles[0].id },
      data: {
        organizationId: iitm.id,
        departmentId: iitmDept?.id,
        enrollments: {
          create: iitmDept?.courses.slice(0, 3).map((course: { id: string }) => ({
            courseId: course.id,
          })),
        },
      },
    }),
    // User 2 in IITB
    prisma.profile.update({
      where: { id: userProfiles[1].id },
      data: {
        organizationId: iitb.id,
        departmentId: iitbDept?.id,
        enrollments: {
          create: iitbDept?.courses.map((course: { id: string }) => ({
            courseId: course.id,
          })),
        },
      },
    }),
    // User 3 in IITD
    prisma.profile.update({
      where: { id: userProfiles[2].id },
      data: {
        organizationId: iitd.id,
        departmentId: iitdDept?.id,
        enrollments: {
          create: iitdDept?.courses.map((course: { id: string }) => ({
            courseId: course.id,
          })),
        },
      },
    }),
  ]);

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
