import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ connected: false });
    }

    // Check if we have Gmail scope in the token
    const hasGmailScope = session.accessToken && 
      (session as any).scope?.includes('https://www.googleapis.com/auth/gmail.readonly');

    return NextResponse.json({ connected: Boolean(hasGmailScope) });
  } catch (error) {
    console.error('Error checking email status:', error);
    return NextResponse.json({ connected: false });
  }
}
