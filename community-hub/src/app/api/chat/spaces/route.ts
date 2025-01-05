import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      console.log('No session or access token');
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'Please sign in to access chat spaces',
        code: 'NO_SESSION'
      }, { status: 401 });
    }

    // Check if we have the required scope
    const scopes = session.scope?.split(' ') || [];
    const hasRequiredScopes = [
      'https://www.googleapis.com/auth/chat.spaces.readonly',
      'https://www.googleapis.com/auth/chat.messages.readonly'
    ].every(scope => scopes.includes(scope));

    if (!hasRequiredScopes) {
      console.log('Missing required scopes');
      return NextResponse.json({
        error: 'Insufficient Permissions',
        details: 'Additional permissions are needed to access Google Chat.',
        code: 'MISSING_SCOPES'
      }, { status: 403 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: session.accessToken as string,
      refresh_token: session.refreshToken as string,
    });

    const chat = google.chat({ version: 'v1', auth: oauth2Client });

    try {
      const response = await chat.spaces.list({
        pageSize: 100,
      });

      const spaces = response.data.spaces || [];
      
      // Filter and format spaces
      const formattedSpaces = await Promise.all(
        spaces.map(async (space) => {
          try {
            // Get members for each space
            const membersResponse = await chat.spaces.members.list({
              parent: space.name,
              pageSize: 1000,
            });

            return {
              name: space.name,
              displayName: space.displayName || 'Unnamed Space',
              type: space.type || 'ROOM',
              members: membersResponse.data.memberships?.map(member => ({
                name: member.member?.name,
                displayName: member.member?.displayName,
                email: member.member?.email,
                avatarUrl: member.member?.avatarUrl,
              })) || [],
            };
          } catch (error) {
            console.error(`Error fetching members for space ${space.name}:`, error);
            return {
              name: space.name,
              displayName: space.displayName || 'Unnamed Space',
              type: space.type || 'ROOM',
              members: [],
            };
          }
        })
      );

      return NextResponse.json({ spaces: formattedSpaces });
    } catch (error: any) {
      console.error('Error fetching chat spaces:', error);
      
      if (error.code === 401 || error.code === 403) {
        return NextResponse.json({
          error: 'Chat access unauthorized',
          details: 'Please reconnect your Google account with Chat permissions.',
          code: 'API_UNAUTHORIZED',
          technicalDetails: error.message
        }, { status: 401 });
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error in chat spaces route:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while fetching chat spaces.',
      technicalDetails: error.message
    }, { status: 500 });
  }
}
