'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { fetchStartups } from '@/lib/api/startups';
import { StartupCard } from '@/components/startups/startup-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function StartupsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: startups, isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: fetchStartups,
  });

  const handleCreateStartup = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/startups/create');
      return;
    }

    if (!session.user.verified) {
      router.push('/verify?callbackUrl=/startups/create');
      return;
    }

    router.push('/startups/create');
  };

  const handleViewMyStartup = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/my-startup');
      return;
    }

    if (!session.user.verified) {
      router.push('/verify?callbackUrl=/my-startup');
      return;
    }

    router.push('/my-startup');
  };

  const userHasStartup = startups?.some(
    (startup) => startup.userId === session?.user?.id
  );

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Startups</h1>
            <p className="text-gray-400">
              Discover innovative startups or create your own
            </p>
          </div>
          {session?.user && !session.user.verified && (
            <Alert variant="warning" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete verification to create or apply to startups.{' '}
                <Button
                  variant="link"
                  className="text-lime-400 p-0 h-auto"
                  onClick={() => router.push('/verify')}
                >
                  Verify now
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Button
            onClick={userHasStartup ? handleViewMyStartup : handleCreateStartup}
            className="bg-lime-400 text-black hover:bg-lime-400/90"
          >
            {userHasStartup ? 'View My Startup' : 'Create Startup'}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="h-64 animate-pulse bg-white/5 border-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups?.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                requiresVerification={!session?.user?.verified}
                onApply={() => {
                  if (!session?.user) {
                    router.push('/auth/signin?callbackUrl=/startups');
                    return;
                  }
                  if (!session.user.verified) {
                    router.push('/verify?callbackUrl=/startups');
                    return;
                  }
                  // Handle apply logic
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
