'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { EmailSection } from "./email-section";
import { EmailDetailModal } from "./email-detail-modal";
import { RefreshCcw } from "lucide-react";
import type { EmailData } from "@/lib/types/email";

export function EmailUpdates() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (!session?.accessToken) {
          setConnected(false);
          return;
        }

        const response = await fetch('/api/emails/status');
        const data = await response.json();
        setConnected(data.connected);
      } catch (error) {
        console.error('Error checking email connection:', error);
        setConnected(false);
        setError('Failed to check email connection');
      }
    }

    checkConnection();
  }, [session]);

  const handleConnect = async () => {
    try {
      // Use signIn directly without checking the connect endpoint
      await signIn('google', {
        callbackUrl: '/coursework',
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        prompt: 'consent',
        access_type: 'offline'
      });
    } catch (error) {
      console.error('Error connecting email:', error);
      setError('Failed to connect email');
    }
  };

  useEffect(() => {
    async function fetchEmails() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/emails');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to fetch emails');
        }
        
        setEmails(data.emails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        setError((error as Error).message);
        
        // If Gmail API is not enabled, show a more helpful message
        if ((error as Error).message.includes('Gmail API not enabled')) {
          setError('The Gmail API needs to be enabled by the administrator. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (connected) {
      fetchEmails();
    }
  }, [connected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/emails');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch emails');
      }
      
      setEmails(data.emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError((error as Error).message);
    } finally {
      setRefreshing(false);
    }
  };

  if (!session) {
    return (
      <Card className="p-6 bg-zinc-900/50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white">Sign In Required</h3>
          <p className="text-muted-foreground">
            Please sign in to access your course-related emails
          </p>
          <Button onClick={() => signIn('google', { 
            callbackUrl: '/coursework',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
          })}>
            Sign In with Google
          </Button>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-zinc-900/50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Error Loading Emails</h3>
          <p className="text-muted-foreground">
            {error}
          </p>
          <Button onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!connected) {
    return (
      <Card className="p-6 bg-zinc-900/50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white">Connect Your Email</h3>
          <p className="text-muted-foreground">
            Connect your Gmail account to see your course-related emails here
          </p>
          <Button onClick={handleConnect}>
            Connect Gmail
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {['High Priority', 'Course Updates', 'General'].map((section) => (
          <div key={section} className="space-y-4">
            <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
            <div className="flex gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="w-[350px] h-[200px] bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const highPriorityEmails = emails.filter(email => email.priority === 'high');
  const mediumPriorityEmails = emails.filter(email => email.priority === 'medium');
  const lowPriorityEmails = emails.filter(email => email.priority === 'low');

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        <EmailSection
          title="High Priority"
          emails={highPriorityEmails}
          color="red"
          onEmailClick={setSelectedEmail}
        />
        <EmailSection
          title="Course Updates"
          emails={mediumPriorityEmails}
          color="yellow"
          onEmailClick={setSelectedEmail}
        />
        <EmailSection
          title="General"
          emails={lowPriorityEmails}
          color="green"
          onEmailClick={setSelectedEmail}
        />
      </div>

      <EmailDetailModal
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />
    </>
  );
}
