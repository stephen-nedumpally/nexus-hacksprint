'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addComment, addReaction } from '@/lib/api/startups';
import type { Startup } from '@/types/startup';

interface StartupDetailsProps {
  startup: Startup;
}

export function StartupDetails({ startup }: StartupDetailsProps) {
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  async function handleReaction(type: 'like' | 'dislike') {
    try {
      await addReaction(startup.id, type);
      toast({
        title: 'Success',
        description: 'Your reaction has been recorded!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record reaction. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function handleComment() {
    if (!comment.trim()) return;

    try {
      await addComment(startup.id, comment);
      setComment('');
      toast({
        title: 'Success',
        description: 'Your comment has been added!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">{startup.name}</h1>
          <p className="text-gray-400 max-w-2xl">{startup.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-lime-400 text-lime-400 hover:bg-lime-400/10"
            onClick={() => handleReaction('like')}
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            {startup.likes.filter(l => l.type === 'like').length}
          </Button>
          <Button
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/10"
            onClick={() => handleReaction('dislike')}
          >
            <ThumbsDown className="w-5 h-5 mr-2" />
            {startup.likes.filter(l => l.type === 'dislike').length}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-4">About</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Founded</span>
              <span className="text-white">{startup.foundedYear}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Team Size</span>
              <span className="text-white">{startup.teamSize}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Domains</span>
              <div className="flex flex-wrap gap-2 justify-end">
                {startup.domain.map((d) => (
                  <Badge 
                    key={d}
                    variant="outline" 
                    className="border-lime-400/50 text-lime-400"
                  >
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
            {startup.website && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Website</span>
                <a 
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Community Feedback</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span className="text-white">Comments</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {startup.comments.length}
              </span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[80px]"
                />
                <Button
                  className="bg-lime-400 text-black hover:bg-lime-400/90"
                  onClick={handleComment}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Comments</h2>
        <div className="space-y-4">
          {startup.comments.map((comment) => (
            <Card 
              key={comment.id}
              className="p-4 border border-white/10 bg-black/50 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white">
                      {comment.user.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
