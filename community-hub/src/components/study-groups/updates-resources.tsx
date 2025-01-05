'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, BookOpen, Link, Video, FileText, Code } from "lucide-react";

interface Update {
  id: number;
  type: "announcement" | "milestone" | "event";
  title: string;
  description: string;
  date: string;
}

interface Resource {
  id: number;
  type: "video" | "article" | "code" | "document";
  title: string;
  description: string;
  link: string;
  addedBy: string;
}

const updates: Update[] = [
  {
    id: 1,
    type: "announcement",
    title: "New React Course Module Released",
    description: "Check out the new advanced React patterns module in the roadmap!",
    date: "2 hours ago"
  },
  {
    id: 2,
    type: "milestone",
    title: "Group Milestone Achieved",
    description: "Our group completed 100+ practice problems this month! ",
    date: "1 day ago"
  },
  {
    id: 3,
    type: "event",
    title: "Upcoming Workshop",
    description: "Join us for a live coding session on building a full-stack app",
    date: "2 days ago"
  },
  {
    id: 4,
    type: "announcement",
    title: "New Project Challenge",
    description: "Start working on the e-commerce project this week",
    date: "3 days ago"
  }
];

const resources: Resource[] = [
  {
    id: 1,
    type: "video",
    title: "React Hooks Deep Dive",
    description: "Master the use of React Hooks with practical examples",
    link: "https://example.com/react-hooks",
    addedBy: "Arjun Mehta"
  },
  {
    id: 2,
    type: "article",
    title: "Modern JavaScript Guide",
    description: "Comprehensive guide to ES6+ features",
    link: "https://example.com/js-guide",
    addedBy: "Priya Sharma"
  },
  {
    id: 3,
    type: "code",
    title: "Node.js Boilerplate",
    description: "Starter template for Node.js projects with TypeScript",
    link: "https://github.com/example/node-starter",
    addedBy: "Vikram Singh"
  },
  {
    id: 4,
    type: "document",
    title: "System Design Patterns",
    description: "PDF guide to common design patterns in web development",
    link: "https://example.com/design-patterns",
    addedBy: "Neha Gupta"
  }
];

const typeIcons = {
  video: <Video className="h-4 w-4" />,
  article: <FileText className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
  document: <BookOpen className="h-4 w-4" />
};

export function Updates() {
  return (
    <Card className="bg-[#0F1218] border border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Latest Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" pr-4">
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="p-4 bg-[#0F1218] rounded-lg rounded-2xl border border-gray-800 hover:bg-gray-900 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    className={
                      update.type === "announcement"
                        ? "bg-blue-500"
                        : update.type === "milestone"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }
                  >
                    {update.type}
                  </Badge>
                  <span className="text-sm text-gray-400">{update.date}</span>
                </div>
                <h3 className="font-medium text-white mb-1">{update.title}</h3>
                <p className="text-sm text-gray-400">{update.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function Resources() {
  const [showCopiedModal, setShowCopiedModal] = useState(false);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setShowCopiedModal(true);
    toast({
      title: "Link copied!",
      description: "Resource link has been copied to clipboard",
    });
  };

  return (
    <Card className=" border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Learning Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" pr-4">
          <div className="space-y-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 bg-[#0F1218] rounded-lg rounded-2xl border border-gray-800 hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-400">
                      {typeIcons[resource.type as keyof typeof typeIcons]}
                    </div>
                    <Badge variant="outline" className="text-white border-gray-600">
                      {resource.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-gray-400 hover:text-white hover:bg-[#1F2937]"
                    onClick={() => handleCopyLink(resource.link)}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-medium text-white mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                <div className="text-sm text-gray-500">Added by {resource.addedBy}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Dialog open={showCopiedModal} onOpenChange={setShowCopiedModal}>
          <DialogContent className="bg-[#0F1218] border border-[#1F2937] text-white">
            <DialogHeader>
              <DialogTitle>Resource Link Copied</DialogTitle>
            </DialogHeader>
            <p className="text-gray-400">
              The resource link has been copied to your clipboard.
            </p>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
