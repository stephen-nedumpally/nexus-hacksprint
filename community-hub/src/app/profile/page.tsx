'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/types/startup';
import { useToast } from "@/components/ui/use-toast";
import { ViewApplicationsDialog } from "@/components/startups/view-applications-dialog";
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VerificationBadge } from "@/components/verify/verification-badge";
import { ProfileEditor } from "@/components/profile/profile-editor";

interface Application {
  id: string;
  startupId: string;
  positionId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  startup: {
    name: string;
    positions: Array<{
      id: string;
      title: string;
    }>;
  };
}

async function fetchMyStartup() {
  const res = await fetch('/api/startups/my');
  if (!res.ok) {
    throw new Error('Failed to fetch startup');
  }
  const data = await res.json();
  return data.notFound ? null : data;
}

async function fetchMyApplications() {
  const res = await fetch('/api/applications/my');
  if (!res.ok) {
    throw new Error('Failed to fetch applications');
  }
  const data = await res.json();
  return data;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const { toast } = useToast();

  const { data: myStartup, error: startupError } = useQuery({
    queryKey: ['myStartup'],
    queryFn: fetchMyStartup,
    enabled: !!session?.user,
  });

  const { data: applications, error: applicationsError } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications,
    enabled: !!session?.user,
  });

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              {session.user?.verified ? (
                <VerificationBadge size="lg" />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => router.push('/verify')}
                >
                  Complete Verification
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-400">
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>

        {session.user?.verified && profile && (
          <div className="mb-8">
            <ProfileEditor profile={profile} onUpdate={refetchProfile} />
          </div>
        )}

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="startup">My Startup</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {applicationsError ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-red-400">
                    Failed to load applications. Please try again later.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {applications?.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{application.startup.name}</CardTitle>
                          <p className="text-sm text-gray-400">
                            {application.startup.positions.find(p => p.id === application.positionId)?.title}
                          </p>
                        </div>
                        <Badge
                          variant={
                            application.status === 'ACCEPTED' ? 'success' :
                            application.status === 'REJECTED' ? 'destructive' :
                            'default'
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {applications?.length === 0 && (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-gray-400">
                        You haven't applied to any positions yet.{' '}
                        <Link href="/startups" className="text-lime-400 hover:underline">
                          Browse startups
                        </Link>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="startup">
            {startupError ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-red-400">
                    Failed to load startup. Please try again later.
                  </p>
                </CardContent>
              </Card>
            ) : !myStartup ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-400">
                    You haven't created a startup yet.{' '}
                    <Link href="/startups/create" className="text-lime-400 hover:underline">
                      Create one now
                    </Link>
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{myStartup.name}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-lime-400">{myStartup.likes?.length || 0}</span> likes •{' '}
                        <span className="font-medium text-red-400">{myStartup.dislikes?.length || 0}</span> dislikes
                      </div>
                      <Link href={`/startups/${myStartup.id}/edit`}>
                        <Button variant="outline">Edit Startup</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Open Positions</h3>
                    <div className="grid gap-4">
                      {myStartup?.positions?.map((position) => (
                        <div key={position.id} className="flex items-center justify-between p-4 rounded-lg border border-white/10">
                          <div>
                            <h4 className="font-medium">{position.title}</h4>
                            <p className="text-sm text-gray-400">{position.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {position.applications?.length || 0} Applicants
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPosition({
                                id: position.id,
                                title: position.title,
                                applications: position.applications || []
                              })}
                            >
                              View Applications
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/startups/${myStartup.id}/positions/new`}>
                      <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Position
                      </Button>
                    </Link>
                  </div>

                  {selectedPosition && (
                    <ViewApplicationsDialog
                      open={!!selectedPosition}
                      onOpenChange={(open) => !open && setSelectedPosition(null)}
                      applications={selectedPosition.applications}
                      positionTitle={selectedPosition.title}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}