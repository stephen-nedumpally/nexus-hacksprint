import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req });

    if (!session || !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we already have Gmail scope
    const hasGmailScope = token.scope?.includes('https://www.googleapis.com/auth/gmail.readonly');
    
    if (hasGmailScope) {
      return NextResponse.json({ connected: true });
    }

    // Return the URL for re-authentication with Gmail scope
    return NextResponse.json({
      url: `/api/auth/signin/google?scope=https://www.googleapis.com/auth/gmail.readonly&prompt=consent&access_type=offline`
    });
  } catch (error) {
    console.error('Error in email connect route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
