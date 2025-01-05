import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const spaceName = searchParams.get('space');
    const threadName = searchParams.get('thread');

    if (!spaceName) {
      return NextResponse.json({ error: 'Space name is required' }, { status: 400 });
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
      let messages;
      if (threadName) {
        // Fetch messages from a specific thread
        const response = await chat.spaces.messages.list({
          parent: spaceName,
          threadKey: threadName,
          pageSize: 100,
        });
        messages = response.data.messages || [];
      } else {
        // Fetch all messages from the space
        const response = await chat.spaces.messages.list({
          parent: spaceName,
          pageSize: 100,
        });
        messages = response.data.messages || [];
      }

      // Process and format messages
      const formattedMessages = messages.map(message => ({
        name: message.name,
        createTime: message.createTime,
        text: message.text || '',
        sender: {
          name: message.sender?.name,
          displayName: message.sender?.displayName,
          email: message.sender?.email,
          avatarUrl: message.sender?.avatarUrl,
        },
        annotations: message.annotations?.map(annotation => ({
          type: annotation.type,
          value: annotation.value,
        })),
        thread: message.thread?.name,
      }));

      return NextResponse.json({ messages: formattedMessages });
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      
      if (error.message?.includes('Chat API has not been used')) {
        return NextResponse.json({
          error: 'Chat API not enabled',
          details: 'The Google Chat API needs to be enabled in your Google Cloud Console.',
          technicalDetails: error.message
        }, { status: 503 });
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error in chat messages route:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while fetching chat messages.',
      technicalDetails: error.message
    }, { status: 500 });
  }
}
