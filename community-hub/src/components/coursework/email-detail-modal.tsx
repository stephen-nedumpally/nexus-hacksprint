'use client';

import { format } from 'date-fns';
import { Paperclip, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EmailData } from '@/lib/types/email';

interface EmailDetailModalProps {
  email: EmailData | null;
  onClose: () => void;
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  if (!email) return null;

  const priorityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  const formatSender = (sender: string) => {
    try {
      const match = sender.match(/([^<]+)?<?([^>]+)?>?/);
      return {
        name: match?.[1]?.trim() || match?.[2] || sender,
        email: match?.[2] || sender,
      };
    } catch {
      return { name: sender, email: sender };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'PPpp'); // e.g., "Jan 5, 2025, 5:07 PM"
    } catch {
      return dateStr;
    }
  };

  const sender = formatSender(email.sender);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {email.subject || "(no subject)"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{sender.name}</p>
                <p className="text-muted-foreground">{sender.email}</p>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "h-6",
                  priorityColors[email.priority]
                )}
              >
                {email.priority}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">
              {formatDate(email.date)}
            </p>

            {email.attachments && email.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <p className="text-muted-foreground flex items-center">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachments:
                </p>
                {email.attachments.map((attachment, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-zinc-800"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    {attachment.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap">
              {email.snippet}
            </div>
          </div>

          {email.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
              {email.labels
                .filter(label => !['INBOX', 'CATEGORY_PERSONAL', 'UNREAD'].includes(label))
                .map(label => (
                  <Badge 
                    key={label} 
                    variant="secondary"
                    className="text-xs bg-zinc-800/50"
                  >
                    {label.toLowerCase().replace('category_', '')}
                  </Badge>
                ))
              }
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
