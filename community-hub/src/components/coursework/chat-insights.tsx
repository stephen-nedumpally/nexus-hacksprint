'use client';

import { AlertCircle, Clock, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const UPDATES = [
  {
    id: 1,
    title: 'Submission Deadline Extended',
    content: 'Final submission deadline extended to 6 PM, 5th January 2025',
    timestamp: '2025-01-05T15:00:00',
    priority: 'high',
    category: 'deadline'
  },
  {
    id: 2,
    title: 'Results Announcement',
    content: 'Results will be announced at 8 PM, 6th January 2025',
    timestamp: '2025-01-05T14:30:00',
    priority: 'medium',
    category: 'announcement'
  },
  {
    id: 3,
    title: 'Video Submission Guidelines',
    content: 'Screen recording with voice explanation required. Keep under 4 minutes and demonstrate key features.',
    timestamp: '2025-01-05T14:00:00',
    priority: 'high',
    category: 'guidelines'
  },
  {
    id: 4,
    title: 'Repository Rules',
    content: 'Regular commits required in 3-hour windows. All code must be merged to main/master branch before deadline.',
    timestamp: '2025-01-05T13:45:00',
    priority: 'high',
    category: 'guidelines'
  },
  {
    id: 5,
    title: 'README Requirements',
    content: 'Should give judges an idea about project and tech stack. Basic project information recommended.',
    timestamp: '2025-01-05T13:30:00',
    priority: 'medium',
    category: 'guidelines'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default:
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'deadline':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'announcement':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'guidelines':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export function ChatInsights() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Important Updates</h2>
          <p className="text-muted-foreground">Stay updated with the latest announcements</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: {formatTimestamp(UPDATES[0].timestamp)}</span>
        </Badge>
      </div>

      <div className="grid gap-4">
        {UPDATES.map((update) => (
          <Card key={update.id} className="p-4 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-2 rounded-lg border",
                getCategoryColor(update.category)
              )}>
                <MessageSquare className="h-4 w-4" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{update.title}</h3>
                    {update.priority === 'high' && (
                      <Badge variant="outline" className={cn(
                        "gap-1",
                        getPriorityColor(update.priority)
                      )}>
                        <AlertCircle className="h-3 w-3" />
                        <span>Important</span>
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(update.timestamp)}
                  </span>
                </div>
                <p className="text-muted-foreground">{update.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
