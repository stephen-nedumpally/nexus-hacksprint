'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseForums } from "@/components/forums/course-forums";
import { EmailUpdates } from "@/components/coursework/email-updates";
import { ChatInsights } from '@/components/coursework/chat-insights';

export default function CourseworkUpdates() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Coursework Updates</h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with your coursework notifications from email and forums
          </p>
        </div>

        <Tabs defaultValue="email" className="space-y-4">
          <TabsList>
          <TabsTrigger value="forum" >My Courses</TabsTrigger>
            <TabsTrigger value="email">Email Updates</TabsTrigger>
            <TabsTrigger value="chat">Chat Insights</TabsTrigger>
            
          </TabsList>
          <TabsContent value="forum" className="mt-6">
          <CourseForums />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailUpdates />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatInsights />
          </TabsContent>

      
        </Tabs>
      </div>
    </main>
  );
}
