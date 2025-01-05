'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight, Code, Book, Trophy, Globe, Database, Server, Cloud } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface SubTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  resources: string[];
  projects: Project[];
  assignments: Assignment[];
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  progress: number;
  completed: boolean;
  subTopics: SubTopic[];
}

const roadmapData: RoadmapNode[] = [
  {
    id: "frontend-basics",
    title: "Frontend Fundamentals",
    description: "Master modern frontend development",
    level: "beginner",
    progress: 80,
    completed: false,
    subTopics: [
      {
        id: "html-css",
        title: "HTML5 & CSS3",
        description: "Modern web development fundamentals",
        completed: true,
        resources: [
          "MDN Web Docs - HTML/CSS Guide",
          "CSS Flexbox & Grid Tutorial",
          "Responsive Design Patterns"
        ],
        projects: [
          {
            id: "p1",
            title: "Portfolio Website",
            description: "Build a responsive portfolio",
            completed: true
          }
        ],
        assignments: [
          {
            id: "a1",
            title: "Responsive Layout Challenge",
            dueDate: "2025-01-15",
            completed: true
          }
        ]
      },
      {
        id: "javascript",
        title: "Modern JavaScript",
        description: "ES6+ features and core concepts",
        completed: false,
        resources: [
          "JavaScript.info",
          "ES6+ Features Guide",
          "Async Programming in JS"
        ],
        projects: [
          {
            id: "p2",
            title: "Task Manager App",
            description: "Build a CRUD application",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a2",
            title: "Async Programming Challenge",
            dueDate: "2025-01-20",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "react",
    title: "React Ecosystem",
    description: "Build modern web applications",
    level: "intermediate",
    progress: 60,
    completed: false,
    subTopics: [
      {
        id: "react-core",
        title: "React Fundamentals",
        description: "Components, props, and state management",
        completed: true,
        resources: [
          "React Official Docs",
          "React Hooks Guide",
          "Component Patterns"
        ],
        projects: [
          {
            id: "p3",
            title: "E-commerce Dashboard",
            description: "Build a React-based dashboard",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a3",
            title: "Custom Hooks Implementation",
            dueDate: "2025-01-25",
            completed: false
          }
        ]
      },
      {
        id: "next-js",
        title: "Next.js Framework",
        description: "Server-side rendering and routing",
        completed: false,
        resources: [
          "Next.js Documentation",
          "SSR vs CSR Guide",
          "Next.js API Routes"
        ],
        projects: [
          {
            id: "p4",
            title: "Blog Platform",
            description: "Full-stack Next.js application",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a4",
            title: "API Routes Challenge",
            dueDate: "2025-02-01",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Server-side programming and APIs",
    level: "intermediate",
    progress: 40,
    completed: false,
    subTopics: [
      {
        id: "node-express",
        title: "Node.js & Express",
        description: "RESTful API development",
        completed: false,
        resources: [
          "Node.js Documentation",
          "Express.js Guide",
          "REST API Best Practices"
        ],
        projects: [
          {
            id: "p5",
            title: "Social Media API",
            description: "Build a RESTful API",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a5",
            title: "Authentication System",
            dueDate: "2025-02-05",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "databases",
    title: "Database Systems",
    description: "Data modeling and management",
    level: "intermediate",
    progress: 30,
    completed: false,
    subTopics: [
      {
        id: "sql",
        title: "SQL Databases",
        description: "PostgreSQL and MySQL",
        completed: false,
        resources: [
          "SQL Fundamentals",
          "PostgreSQL Tutorial",
          "Database Design Patterns"
        ],
        projects: [
          {
            id: "p6",
            title: "E-commerce Database",
            description: "Design and implement database schema",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a6",
            title: "Complex Queries Challenge",
            dueDate: "2025-02-10",
            completed: false
          }
        ]
      },
      {
        id: "nosql",
        title: "NoSQL Databases",
        description: "MongoDB and Redis",
        completed: false,
        resources: [
          "MongoDB University",
          "Redis Basics",
          "NoSQL Design Patterns"
        ],
        projects: [
          {
            id: "p7",
            title: "Real-time Chat System",
            description: "Build with MongoDB and Redis",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a7",
            title: "Data Modeling Challenge",
            dueDate: "2025-02-15",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "deployment",
    title: "DevOps & Deployment",
    description: "Deploy and scale applications",
    level: "advanced",
    progress: 20,
    completed: false,
    subTopics: [
      {
        id: "docker",
        title: "Containerization",
        description: "Docker and container orchestration",
        completed: false,
        resources: [
          "Docker Documentation",
          "Kubernetes Basics",
          "Container Security"
        ],
        projects: [
          {
            id: "p8",
            title: "Microservices Architecture",
            description: "Containerized application deployment",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a8",
            title: "Container Orchestration",
            dueDate: "2025-02-20",
            completed: false
          }
        ]
      },
      {
        id: "cloud",
        title: "Cloud Services",
        description: "AWS/GCP/Azure fundamentals",
        completed: false,
        resources: [
          "AWS Essentials",
          "Cloud Architecture Patterns",
          "Serverless Computing"
        ],
        projects: [
          {
            id: "p9",
            title: "Serverless Application",
            description: "Build and deploy to AWS Lambda",
            completed: false
          }
        ],
        assignments: [
          {
            id: "a9",
            title: "Cloud Infrastructure Setup",
            dueDate: "2025-02-25",
            completed: false
          }
        ]
      }
    ]
  }
];

const levelColors = {
  beginner: "bg-green-500",
  intermediate: "bg-blue-600",
  advanced: "bg-purple-600"
};

const levelIcons = {
  beginner: <Globe className="h-5 w-5" />,
  intermediate: <Server className="h-5 w-5" />,
  advanced: <Cloud className="h-5 w-5" />
};

export default function DetailedRoadmap() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [expandedSubTopic, setExpandedSubTopic] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {roadmapData.map((node) => (
        <motion.div
          key={node.id}
          className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
          initial={false}
        >
          <div
            className="p-6 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${levelColors[node.level]} bg-opacity-20`}>
                  {levelIcons[node.level]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{node.title}</h3>
                  <p className="text-gray-400">{node.description}</p>
                </div>
              </div>
              <Badge className={`${levelColors[node.level]} text-white`}>
                {node.level}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>{node.progress}%</span>
              </div>
              <Progress value={node.progress} className="bg-gray-800" />
            </div>
          </div>

          <AnimatePresence>
            {expandedNode === node.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-4">
                  {node.subTopics.map((subTopic) => (
                    <div key={subTopic.id} className="bg-gray-800 rounded-lg border border-gray-700">
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => setExpandedSubTopic(expandedSubTopic === subTopic.id ? null : subTopic.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {subTopic.completed ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                            <h4 className="font-medium text-white">{subTopic.title}</h4>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSubTopic === subTopic.id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4">
                              <div className="space-y-4">
                                {/* Resources */}
                                <div>
                                  <h5 className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                    <Book className="h-4 w-4 mr-2" />
                                    Learning Resources
                                  </h5>
                                  <ul className="space-y-2 text-gray-300">
                                    {subTopic.resources.map((resource, index) => (
                                      <li key={index} className="flex items-center space-x-2">
                                        <span>•</span>
                                        <span>{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Projects */}
                                <div>
                                  <h5 className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                    <Code className="h-4 w-4 mr-2" />
                                    Projects
                                  </h5>
                                  <div className="space-y-2">
                                    {subTopic.projects.map((project) => (
                                      <div
                                        key={project.id}
                                        className="flex items-center justify-between p-2 bg-gray-700 rounded"
                                      >
                                        <div>
                                          <div className="font-medium text-white">{project.title}</div>
                                          <div className="text-sm text-gray-400">{project.description}</div>
                                        </div>
                                        {project.completed && (
                                          <Badge className="bg-green-500">Completed</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Assignments */}
                                <div>
                                  <h5 className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Assignments
                                  </h5>
                                  <div className="space-y-2">
                                    {subTopic.assignments.map((assignment) => (
                                      <div
                                        key={assignment.id}
                                        className="flex items-center justify-between p-2 bg-gray-700 rounded"
                                      >
                                        <div>
                                          <div className="font-medium text-white">{assignment.title}</div>
                                          <div className="text-sm text-gray-400">Due: {assignment.dueDate}</div>
                                        </div>
                                        {assignment.completed && (
                                          <Badge className="bg-green-500">Completed</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
