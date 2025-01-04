export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Level {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Department {
  id: string;
  name: string;
  levels?: Level[];
  subjects?: Subject[]; // For departments without specific levels
}

export interface Organization {
  id: string;
  name: string;
  departments: Department[];
}

// IIT Madras BSc Courses
const iitMadrasBScLevels: Level[] = [
  {
    id: "foundation",
    name: "Foundation Level",
    subjects: [
      { id: "mds1", name: "Mathematics for Data Science 1" },
      { id: "eng1", name: "English 1" },
      { id: "ct", name: "Computational Thinking" },
      { id: "sds1", name: "Statistics for Data Science 1" },
      { id: "mds2", name: "Mathematics for Data Science 2" },
      { id: "eng2", name: "English 2" },
      { id: "python", name: "Introduction to Python Programming" },
      { id: "sds2", name: "Statistics for Data Science 2" },
    ],
  },
  {
    id: "diploma",
    name: "Diploma Level",
    subjects: [
      { id: "mlf", name: "Machine Learning Foundations" },
      { id: "mlt", name: "Machine Learning Techniques" },
      { id: "mlp", name: "Machine Learning Practice" },
      { id: "bdm", name: "Business Data Management" },
      { id: "ba", name: "Business Analytics" },
      { id: "tds", name: "Tools in Data Science" },
      { id: "pdsa", name: "Programming, Data Structures and Algorithms using Python" },
      { id: "dbms", name: "Database Management System" },
      { id: "ad1", name: "Application Development 1" },
      { id: "java", name: "Programming Concepts using Java" },
      { id: "syscmd", name: "System Commands" },
      { id: "ad2", name: "Application Development 2" },
    ],
  },
  {
    id: "degree",
    name: "Degree Level",
    subjects: [
      { id: "st", name: "Software Testing" },
      { id: "se", name: "Software Engineering" },
      { id: "dl", name: "Deep Learning" },
      { id: "ai", name: "AI: Search Methods for Problem Solving" },
      { id: "spg", name: "Strategies for Professional Growth" },
      { id: "bigdata", name: "Introduction to Big Data" },
      { id: "c", name: "Programming in C" },
      { id: "algo", name: "Advanced Algorithms" },
      { id: "gt", name: "Game Theory and Strategy" },
      { id: "speech", name: "Speech Technology" },
      { id: "dtdd", name: "Design Thinking for Data-Driven App Development" },
      { id: "mr", name: "Market Research" },
      { id: "psosm", name: "Privacy & Security in Online Social Media" },
      { id: "sc", name: "Statistical Computing" },
      { id: "csd", name: "Computer Systems Design" },
      { id: "ff", name: "Financial Forensics" },
      { id: "nlp", name: "Introduction to Natural Language Processing" },
      { id: "cf", name: "Corporate Finance" },
      { id: "dlcv", name: "Deep Learning for CV" },
      { id: "llm", name: "Large Language Models" },
      { id: "dlp", name: "Deep Learning Practice" },
    ],
  },
];

// List of IITs and their departments
export const organizations: Organization[] = [
  {
    id: "iitm",
    name: "IIT Madras",
    departments: [
      {
        id: "bsc-ds",
        name: "BSc Data Science and Programming",
        levels: iitMadrasBScLevels,
      },
      // Add other departments as needed
    ],
  },
  {
    id: "iitb",
    name: "IIT Bombay",
    departments: [
      {
        id: "bsc-prog",
        name: "BSc Programming and Data Science",
        subjects: [
          // Add subjects for IIT Bombay
        ],
      },
    ],
  },
  {
    id: "iitd",
    name: "IIT Delhi",
    departments: [
      {
        id: "bsc-ai",
        name: "BSc Artificial Intelligence",
        subjects: [
          // Add subjects for IIT Delhi
        ],
      },
    ],
  },
  {
    id: "iitk",
    name: "IIT Kanpur",
    departments: [
      {
        id: "bsc-cs",
        name: "BSc Computer Science",
        subjects: [
          // Add subjects for IIT Kanpur
        ],
      },
    ],
  },
  // Add more IITs as needed
];
