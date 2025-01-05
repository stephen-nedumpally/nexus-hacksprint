'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateStartupForm from '@/components/startups/create-startup-form';
import { RequireVerification } from "@/components/auth/require-verification";

function CreateStartupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/startups/create');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Startup</CardTitle>
            <CardDescription>
              Share your vision and find talented teammates to join your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateStartupForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default RequireVerification(CreateStartupPage);
