'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-muted-foreground">
        {error === 'Configuration'
          ? 'There is a problem with the server configuration.'
          : error === 'AccessDenied'
          ? 'You do not have permission to sign in.'
          : 'An error occurred while trying to sign in.'}
      </p>
      <Button asChild>
        <Link href="/auth/signin">Try Again</Link>
      </Button>
    </div>
  );
}
