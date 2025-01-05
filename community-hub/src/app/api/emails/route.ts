import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials from session
    oauth2Client.setCredentials({
      access_token: session.accessToken as string,
      refresh_token: session.refreshToken as string,
    });

    // Create Gmail client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
      // Get list of emails
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 20,
        q: 'in:inbox',
      });

      if (!response.data.messages) {
        return NextResponse.json({ emails: [] });
      }

      const emails = await Promise.all(
        response.data.messages.map(message => 
          fetchEmailDetails(gmail, message.id!)
        )
      );

      const validEmails = emails.filter(email => email !== null);

      return NextResponse.json({ emails: validEmails });
    } catch (error: any) {
      console.error('Error fetching emails list:', error);
      
      // Check for Gmail API not enabled error
      if (error.message?.includes('Gmail API has not been used') || error.message?.includes('disabled')) {
        return NextResponse.json({
          error: 'Gmail API not enabled',
          details: 'The Gmail API needs to be enabled in your Google Cloud Console. Please contact the administrator to enable the Gmail API.',
          technicalDetails: error.message
        }, { status: 503 });
      }
      
      // Handle other API errors
      if (error.code === 401 || error.code === 403) {
        return NextResponse.json({
          error: 'Gmail access unauthorized',
          details: 'Please reconnect your Gmail account.',
          technicalDetails: error.message
        }, { status: 401 });
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Error in email route:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while fetching your emails.',
      technicalDetails: error.message
    }, { status: 500 });
  }
}

function determineEmailPriority(subject: string, snippet: string, from: string): 'high' | 'medium' | 'low' {
  const text = `${subject} ${snippet}`.toLowerCase();
  const sender = from.toLowerCase();

  // High priority keywords and patterns
  const highPriorityKeywords = [
    'urgent', 'important', 'asap', 'emergency',
    'deadline', 'due today', 'due tomorrow',
    'reminder', 'overdue', 'final notice',
    'assignment due', 'exam', 'quiz today',
    'immediate attention', 'action required'
  ];

  // Medium priority academic patterns
  const mediumPriorityPatterns = [
    // Course related
    'lecture', 'class', 'course', 'syllabus',
    'assignment', 'homework', 'project',
    'study group', 'office hours',
    // Academic senders
    '.edu', 'professor', 'instructor', 'faculty',
    'department', 'academic', 'university',
    // Learning platforms
    'canvas', 'blackboard', 'moodle',
    'coursera', 'udemy', 'edx'
  ];

  // Check for high priority patterns
  if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  }

  // Check for academic patterns
  if (
    mediumPriorityPatterns.some(pattern => text.includes(pattern)) ||
    mediumPriorityPatterns.some(pattern => sender.includes(pattern))
  ) {
    return 'medium';
  }

  // Everything else is low priority
  return 'low';
}

async function fetchEmailDetails(gmail: any, messageId: string) {
  try {
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });

    const headers = email.data.payload?.headers;
    const subject = headers?.find((h: any) => h.name === 'Subject')?.value || '';
    const from = headers?.find((h: any) => h.name === 'From')?.value || '';
    const date = headers?.find((h: any) => h.name === 'Date')?.value || '';

    return {
      id: email.data.id!,
      threadId: email.data.threadId!,
      subject,
      snippet: email.data.snippet || '',
      sender: from,
      date,
      labels: email.data.labelIds || [],
      priority: determineEmailPriority(subject, email.data.snippet || '', from),
      isRead: !email.data.labelIds?.includes('UNREAD'),
      attachments: getAttachments(email.data),
    };
  } catch (error) {
    console.error('Error fetching email details:', error);
    return null;
  }
}

function getAttachments(email: any) {
  const attachments: { name: string; url: string; }[] = [];
  const parts = email.payload?.parts || [];

  parts.forEach((part: any) => {
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        name: part.filename,
        url: `/api/emails/${email.id}/attachments/${part.body.attachmentId}`,
      });
    }
  });

  return attachments;
}
