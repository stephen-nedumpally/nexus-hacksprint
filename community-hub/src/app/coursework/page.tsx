'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { gmail_v1 } from "googleapis";
import { CourseForums } from "@/components/forums/course-forums";

interface EmailUpdate {
  id: string;
  subject: string;
  snippet: string;
  date: string;
  source: "Gmail" | "College" | "Forum";
  labels?: string[];
  unread?: boolean;
}

export default function CourseworkUpdates() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [updates, setUpdates] = useState<EmailUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement email fetching
    // This is mock data for now
    const mockUpdates: EmailUpdate[] = [
      {
        id: '1',
        subject: 'Assignment Deadline Extended: Web Development',
        snippet: 'The deadline for the React project has been extended to next Friday...',
        date: '2025-01-05',
        source: 'Gmail',
        labels: ['Assignment', 'Important'],
        unread: true
      },
      {
        id: '2',
        subject: 'New Course Materials Available',
        snippet: 'New materials for Machine Learning course have been uploaded...',
        date: '2025-01-04',
        source: 'College',
        labels: ['Course Material']
      },
      {
        id: '3',
        subject: 'Discussion: Database Design Project',
        snippet: 'New responses in the database design project discussion...',
        date: '2025-01-03',
        source: 'Forum',
        labels: ['Discussion']
      },
    ];

    setUpdates(mockUpdates);
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Coursework Updates</h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with your coursework notifications from email and forums
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="forum">Forums</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ScrollArea className="h-[600px] pr-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="mb-4 bg-zinc-900/50">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                      <Skeleton className="h-3 w-1/4 mt-2 bg-zinc-800" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full bg-zinc-800" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                updates.map((update) => (
                  <Card key={update.id} className="mb-4 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">
                          {update.subject}
                          {update.unread && (
                            <Badge className="ml-2 bg-blue-500">New</Badge>
                          )}
                        </CardTitle>
                        <Badge variant="outline">{update.source}</Badge>
                      </div>
                      <CardDescription>
                        {new Date(update.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{update.snippet}</p>
                      <div className="flex gap-2 mt-2">
                        {update.labels?.map((label) => (
                          <Badge key={label} variant="secondary">{label}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="email">
            {/* Email-specific content */}
          </TabsContent>

          <TabsContent value="forum">
            {/* Forum-specific content */}
          </TabsContent>

<TabsContent value="courses" className="mt-6">
            <CourseForums />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
