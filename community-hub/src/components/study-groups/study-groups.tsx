'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface StudyGroup {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  organization: {
    name: string;
    verified: boolean;
  };
  members: {
    current: number;
    total: number;
  };
  levels: string[];
  nextSession: string;
}

interface StudyGroupCardProps {
  group: StudyGroup;
}

function StudyGroupCard({ group }: StudyGroupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (group.id === "1") { // Full-Stack Development group
      router.push("/study-groups/full-stack");
    } else {
      setShowWaitlistDialog(true);
    }
  };

  return (
    <>
      <Card 
        className="w-[300px] shrink-0 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
        onClick={() => setExpanded(!expanded)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(253, 185, 0, 0.25), transparent 40%)`
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={{
            border: `1px solid rgba(253, 185, 0, ${mousePosition.x > 0 ? 0.15 : 0})`
          }}
        />
        <div className="relative z-20">
          <div className="relative h-40">
            <img
              src={group.imageUrl}
              alt={group.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {group.organization.verified && (
              <Badge className="absolute top-2 right-2 bg-blue-500">Verified</Badge>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{group.title}</CardTitle>
            <CardDescription>{group.organization.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Members</span>
                <span>{group.members.current}/{group.members.total}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Next Session: {group.nextSession}
              </div>
              {expanded && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <p className="text-sm line-clamp-3">{group.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.levels.map((level) => (
                      <Badge key={level} variant="outline">
                        {level}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleJoin}
                  >
                    {group.id === "1" ? "View Group" : "Join Waitlist"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Added to Waitlist!</DialogTitle>
            <DialogDescription>
              You've been added to the waitlist for {group.title}. We'll notify you when a spot becomes available.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

const studyGroups = {
  coding: [
    {
      id: "1",
      title: "Full-Stack Development",
      description: "Master modern web development with React, Node.js, and MongoDB. Weekly coding sessions and project reviews.",
      imageUrl: "https://img-c.udemycdn.com/course/480x270/1042110_ffc3_4.jpg",
      organization: { name: "Web Dev Society", verified: true },
      members: { current: 15, total: 20 },
      levels: ["Beginner", "Intermediate", "Advanced"],
      nextSession: "Jan 10, 2025"
    },
    {
      id: "2",
      title: "Python Programming",
      description: "Learn Python from basics to advanced concepts. Focus on practical applications and problem-solving.",
      imageUrl: "https://i0.wp.com/www.learncsdesign.com/wp-content/uploads/2023/01/python.webp?fit=522%2C246&ssl=1",
      organization: { name: "Code Club", verified: true },
      members: { current: 12, total: 15 },
      levels: ["Beginner", "Intermediate"],
      nextSession: "Jan 12, 2025"
    },
    {
      id: "3",
      title: "DSA Practice",
      description: "Daily problem solving and algorithm practice. Prepare for technical interviews together.",
      imageUrl: "https://30dayscoding.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F3pv3o0yr6pgj%2F5KSVf7vuNxFjxcHfm9idjM%2F4e5563dfa5f1ca9cc169a7274a7dbcac%2F64f93394e4b0e75ce98af312_scaled_cover.jpg&w=3840&q=75",
      organization: { name: "Algorithm Masters", verified: true },
      members: { current: 18, total: 25 },
      levels: ["Intermediate", "Advanced"],
      nextSession: "Jan 8, 2025"
    },
    {
      id: "4",
      title: "Mobile App Dev",
      description: "Build cross-platform mobile apps using React Native and Flutter.",
      imageUrl: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/6584ce50b417f2b4cfae947a_Mobile%20App%20Developer%20Stats%2C%20Trends%2C%20and%20Forecasts%20for%202024.webp",
      organization: { name: "App Builders", verified: false },
      members: { current: 10, total: 15 },
      levels: ["Intermediate"],
      nextSession: "Jan 15, 2025"
    }
  ],
  ai: [
    {
      id: "5",
      title: "ML Fundamentals",
      description: "Learn machine learning basics with Python and scikit-learn. Hands-on projects and model building.",
      imageUrl: "https://miro.medium.com/v2/resize:fit:794/0*PVdHybB6Vvj3jleY.jpg",
      organization: { name: "AI Research Club", verified: true },
      members: { current: 20, total: 25 },
      levels: ["Beginner", "Intermediate"],
      nextSession: "Jan 11, 2025"
    },
    {
      id: "6",
      title: "Deep Learning",
      description: "Advanced neural networks and deep learning architectures using PyTorch.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQBgh_aNenj0BT8HUgm6W_WjroR6ukmA05cg&s",
      organization: { name: "Deep Minds", verified: true },
      members: { current: 15, total: 20 },
      levels: ["Advanced"],
      nextSession: "Jan 13, 2025"
    },
    {
      id: "7",
      title: "AI Projects",
      description: "Collaborative AI project building. Current focus: Computer Vision applications.",
      imageUrl: "https://www.indianai.in/wp-content/uploads/2021/02/ai-projects.jpg",
      organization: { name: "Project AI", verified: false },
      members: { current: 8, total: 12 },
      levels: ["Intermediate", "Advanced"],
      nextSession: "Jan 14, 2025"
    }
  ],
  business: [
    {
      id: "8",
      title: "Digital Marketing",
      description: "Learn SEO, social media marketing, and content strategy. Weekly case studies.",
      imageUrl: "https://media.licdn.com/dms/image/v2/D5612AQGUd6R2y9GhDw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680729732782?e=2147483647&v=beta&t=p5vcx2bFn--uw2ccvlrU465hIgDHhyUQxYRl0Bco_eE",
      organization: { name: "Marketing Hub", verified: true },
      members: { current: 25, total: 30 },
      levels: ["Beginner", "Intermediate"],
      nextSession: "Jan 9, 2025"
    },
    {
      id: "9",
      title: "Finance Basics",
      description: "Understanding financial markets, investment strategies, and portfolio management.",
      imageUrl: "https://www.shutterstock.com/image-photo/analyst-uses-computer-dashboard-data-600nw-2285412737.jpg",
      organization: { name: "Finance Club", verified: true },
      members: { current: 18, total: 20 },
      levels: ["Beginner"],
      nextSession: "Jan 16, 2025"
    },
    {
      id: "10",
      title: "Startup Growth",
      description: "Learn startup strategies, fundraising, and growth hacking techniques.",
      imageUrl: "/startup.jpg",
      organization: { name: "Founder's Club", verified: true },
      members: { current: 12, total: 15 },
      levels: ["Intermediate"],
      nextSession: "Jan 12, 2025"
    },
    {
      id: "11",
      title: "Sales Mastery",
      description: "B2B sales strategies, negotiation skills, and client relationship management.",
      imageUrl: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2023/07/resource-How-to-Create-a-Sales-Plan-A-complete-Guide.jpg?w=1024",
      organization: { name: "Sales Pro", verified: false },
      members: { current: 15, total: 20 },
      levels: ["Beginner", "Intermediate"],
      nextSession: "Jan 18, 2025"
    }
  ]
};

export default function StudyGroups() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Coding Groups</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-max space-x-4 p-4">
            {studyGroups.coding.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">AI & Machine Learning</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-max space-x-4 p-4">
            {studyGroups.ai.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Business & Finance</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-max space-x-4 p-4">
            {studyGroups.business.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
