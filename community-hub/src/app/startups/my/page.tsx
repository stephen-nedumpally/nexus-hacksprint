'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Startup } from '@/types/startup';
import { CreatePositionDialog } from '@/components/startups/create-position-dialog';

export default function MyStartupPage() {
  const { data: session } = useSession();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreatePositionOpen, setIsCreatePositionOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/startups/my`)
        .then((res) => res.json())
        .then((data) => {
          setStartup(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching startup:', error);
          setLoading(false);
        });
    }
  }, [session?.user?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!startup) {
    return <div>No startup found</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{startup.name}</h1>
        <Button
          onClick={() => setIsCreatePositionOpen(true)}
          className="bg-lime-400 text-black hover:bg-lime-400/90"
        >
          Create New Position
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="engagement">Community Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Startup Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Domains</h3>
                <div className="flex gap-2 mt-2">
                  {startup.domain.map((domain) => (
                    <Badge key={domain} variant="outline">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium">Problem Statement</h3>
                <p className="mt-2 text-muted-foreground">{startup.problem}</p>
              </div>

              <div>
                <h3 className="font-medium">Solution</h3>
                <p className="mt-2 text-muted-foreground">{startup.solution}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {startup.positions.map((position) => (
                  <Card key={position.id}>
                    <CardHeader>
                      <CardTitle>{position.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{position.description}</p>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Required Skills</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {position.requirements.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Add applications list */}
              <div className="text-muted-foreground">No applications yet</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{startup.likes?.length || 0}</div>
                  <div className="text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{startup.dislikes?.length || 0}</div>
                  <div className="text-muted-foreground">Dislikes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{startup.comments?.length || 0}</div>
                  <div className="text-muted-foreground">Comments</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Recent Comments</h3>
                {startup.comments?.length ? (
                  startup.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-muted-foreground">{comment.content}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No comments yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreatePositionDialog
        open={isCreatePositionOpen}
        onOpenChange={setIsCreatePositionOpen}
        startupId={startup.id}
        onPositionCreated={(position) => {
          setStartup((prev) => ({
            ...prev!,
            positions: [...prev!.positions, position],
          }));
        }}
      />
    </div>
  );
}
