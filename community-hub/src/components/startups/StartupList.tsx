'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AuthCheckModal, useAuthCheck } from '@/components/auth/AuthCheckModal';
import { Startup } from '@/types/startup';

export function StartupList() {
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAuthModal, setShowAuthModal, authActionText, checkAuth } = useAuthCheck();

  useEffect(() => {
    fetch('/api/startups')
      .then((res) => res.json())
      .then((data) => {
        setStartups(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching startups:', error);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (startupId: string) => {
    if (!checkAuth(session, 'view startup details')) {
      return;
    }
    // Navigate to startup details
    window.location.href = `/startups/${startupId}`;
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 bg-muted rounded w-20"></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No startups found</h3>
        <p className="text-muted-foreground">Be the first to create a startup project!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{startup.name}</CardTitle>
              <CardDescription>{startup.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <p className="font-medium">{startup.stage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{startup.teamSize} members</p>
                  </div>
                </div>

                <Separator />

                {/* Tech Stack */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
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
                <div>
                  <h4 className="text-sm font-medium mb-2">Open Positions</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.positions.map((position) => (
                      <Badge key={position.title} variant="outline">
                        {position.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link 
                href={`/startups/${startup.id}`}
                className="w-full"
              >
                <Button className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AuthCheckModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText={authActionText}
      />
    </>
  );
}
