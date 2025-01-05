'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Paperclip, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EmailData } from '@/lib/types/email';

interface EmailCardProps {
  email: EmailData;
  onClick?: () => void;
}

export function EmailCard({ email, onClick }: EmailCardProps) {
  const priorityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  const formatSender = (sender: string) => {
    try {
      const match = sender.match(/([^<]+)?<?([^>]+)?>?/);
      return match?.[1]?.trim() || match?.[2] || sender;
    } catch {
      return sender;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM d, h:mm a');
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'w-[350px] p-4 space-y-3 cursor-pointer bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors',
          !email.isRead && 'border-l-4 border-l-blue-500'
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {formatSender(email.sender)}
            </p>
            <h3 className={cn(
              "text-base font-semibold leading-tight mt-1 line-clamp-2",
              !email.isRead && "text-white"
            )}>
              {email.subject || "(no subject)"}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(email.date)}
            </p>
            <div className="flex items-center gap-2">
              {email.attachments && email.attachments.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {email.attachments.length}
                </Badge>
              )}
              <Badge 
                variant="secondary" 
                className={cn(
                  "h-5",
                  priorityColors[email.priority]
                )}
              >
                {email.priority}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {email.snippet}
        </p>

        <div className="flex gap-2 flex-wrap">
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
      </Card>
    </motion.div>
  );
}
