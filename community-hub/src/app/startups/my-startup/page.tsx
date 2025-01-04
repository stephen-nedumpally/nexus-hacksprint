'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyStartup } from '@/lib/api/startups';
import { CreatePositionForm } from '@/components/startups/create-position-form';
import type { Startup } from '@/types/startup';

export default function MyStartupPage() {
  const { data: startup, isLoading } = useQuery<Startup>({
    queryKey: ['my-startup'],
    queryFn: getMyStartup,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">No Startup Found</h1>
            <p className="text-gray-400 mb-8">You haven't created a startup listing yet.</p>
            <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
              Create Startup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{startup.name}</h1>
            <p className="text-gray-400 max-w-2xl mb-4">{startup.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-lime-400" />
                <span className="text-white">{startup.likes.filter(l => l.type === 'like').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-400" />
                <span className="text-white">{startup.likes.filter(l => l.type === 'dislike').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span className="text-white">{startup.comments.length}</span>
              </div>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Position</DialogTitle>
              </DialogHeader>
              <CreatePositionForm startupId={startup.id} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="feedback">Community Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {startup.positions.map((position) => (
                <Card 
                  key={position.id}
                  className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {position.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{position.description}</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {position.requirements.skills.map((skill) => (
                          <Badge 
                            key={skill}
                            variant="outline" 
                            className="border-lime-400/50 text-lime-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Experience Required</span>
                      <span className="text-white">
                        {position.requirements.experience < 12
                          ? `${position.requirements.experience} months`
                          : `${Math.floor(position.requirements.experience / 12)} years`}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="space-y-6">
              {startup.positions.map((position) => (
                <div key={position.id} className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    {position.title} Applications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {position.applications.map((application) => (
                      <Card 
                        key={application.id}
                        className="p-4 border border-white/10 bg-black/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-white">
                              {application.user.name}
                            </h4>
                            <p className="text-sm text-gray-400">
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={application.status === 'pending' ? 'outline' : 
                                   application.status === 'accepted' ? 'success' : 'destructive'}
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <div className="mt-4 space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-lime-400 text-lime-400 hover:bg-lime-400/10"
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-400/10"
                          >
                            Reject
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Idea Validation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-lime-400" />
                        <span className="text-white">Likes</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {startup.likes.filter(l => l.type === 'like').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-5 h-5 text-red-400" />
                        <span className="text-white">Dislikes</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {startup.likes.filter(l => l.type === 'dislike').length}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Community Engagement</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Comments</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {startup.comments.length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Recent Comments</h3>
                <div className="space-y-4">
                  {startup.comments.map((comment) => (
                    <Card 
                      key={comment.id}
                      className="p-4 border border-white/10 bg-black/50 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {comment.user.name}
                            </span>
                            <span className="text-sm text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-400">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
