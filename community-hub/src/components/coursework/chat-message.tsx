'use client';

import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types/chat';

interface ChatMessageProps {
  message: ChatMessage;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ChatMessage({ message, isSelected, onClick }: ChatMessageProps) {
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM d, h:mm a');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-colors',
        isSelected ? 'bg-zinc-800/50' : 'bg-zinc-900/50 hover:bg-zinc-800/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar>
          {message.sender.avatarUrl && (
            <AvatarImage src={message.sender.avatarUrl} />
          )}
          <AvatarFallback>
            {message.sender.displayName?.charAt(0).toUpperCase() || 
             message.sender.email?.charAt(0).toUpperCase() || 
             'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                {message.sender.displayName || message.sender.email}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {formatTime(message.createTime)}
              </span>
            </div>
            {message.thread && (
              <Badge variant="secondary" className="text-xs">
                Thread
              </Badge>
            )}
          </div>

          <p className="text-sm whitespace-pre-wrap">{message.text}</p>

          {message.annotations && message.annotations.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.annotations.map((annotation, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                >
                  {annotation.type}: {annotation.value}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
