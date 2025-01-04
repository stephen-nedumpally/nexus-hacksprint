'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { formatNumber, formatDate } from '@/lib/utils';
import { Startup } from '@/types/startup';
import { ViewOpportunitiesDialog } from '@/components/startups/view-opportunities-dialog';

export default function StartupDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  useEffect(() => {
    const startupId = React.use(params).id;
    setLoading(true);
    fetch(`/api/startups/${startupId}`)
      .then((res) => res.json())
      .then((data) => {
        setStartup(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching startup:', error);
        setLoading(false);
      });
  }, [params]);

  const handleApply = (positionId: string) => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/startups/${params.id}`);
      return;
    }
    setSelectedPosition(positionId);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold">Startup not found</h3>
            <p className="text-muted-foreground">The startup you're looking for doesn't exist.</p>
            <Link href="/startups" className="mt-4 inline-block">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Startups
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/startups">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">{startup.name}</CardTitle>
              <CardDescription className="mt-2">{startup.description}</CardDescription>
            </div>
            {startup.logo && (
              <img
                src={startup.logo}
                alt={`${startup.name} logo`}
                className="w-24 h-24 object-contain"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Founded</p>
              <p className="text-2xl font-semibold">{formatDate(startup?.founded)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-semibold">{startup.teamSize} members</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stage</p>
              <p className="text-2xl font-semibold">{startup.stage}</p>
            </div>
          </div>

          <Separator />

          {/* Problem & Solution */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Problem Statement</h3>
              <p className="text-muted-foreground">{startup.problemStatement}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Our Solution</h3>
              <p className="text-muted-foreground">{startup.solution}</p>
            </div>
          </div>

          <Separator />

          {/* Market & Traction */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Market & Traction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">TAM</p>
                <p className="text-2xl font-semibold">${formatNumber(startup.tam)}M</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SAM</p>
                <p className="text-2xl font-semibold">${formatNumber(startup.sam)}M</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Competitors</p>
                <p className="text-2xl font-semibold">{startup.competitors}</p>
              </div>
              {startup.mrr && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-2xl font-semibold">${formatNumber(startup.mrr)}</p>
                </div>
              )}
            </div>
            {startup.traction && (
              <div>
                <h4 className="text-sm font-medium mb-2">Key Metrics & Traction</h4>
                <p className="text-muted-foreground">{startup.traction}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Funding */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startup.fundingRound && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Round</p>
                  <p className="text-2xl font-semibold">{startup.fundingRound}</p>
                </div>
              )}
              {startup.fundingRaised && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                  <p className="text-2xl font-semibold">${startup.fundingRaised}M</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {startup.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Open Positions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Open Positions</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {startup.positions.map((position) => (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <CardDescription>{position.description}</CardDescription>
                      </div>
                      <Button 
                        className="bg-lime-400 text-black hover:bg-lime-400/90"
                        onClick={() => handleApply(position.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.requirements.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Experience</h4>
                        <p>{position.requirements.experience} years</p>
                      </div>
                      {position.requirements.education && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Education</h4>
                          <p>{position.requirements.education}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPosition && startup && (
        <ViewOpportunitiesDialog
          startup={startup}
          open={!!selectedPosition}
          onOpenChange={() => setSelectedPosition(null)}
          selectedPositionId={selectedPosition}
        />
      )}
    </div>
  );
}
