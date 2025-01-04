'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface StartupInteractionsProps {
  startupId: string;
  initialLikes: number;
  initialDislikes: number;
  initialComments: Comment[];
  userLiked?: boolean;
  userDisliked?: boolean;
}

export function StartupInteractions({
  startupId,
  initialLikes = 0,
  initialDislikes = 0,
  initialComments = [],
  userLiked = false,
  userDisliked = false,
}: StartupInteractionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hasLiked, setHasLiked] = useState(userLiked);
  const [hasDisliked, setHasDisliked] = useState(userDisliked);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthRequired = () => {
    router.push(`/auth/signin?callbackUrl=/startups/${startupId}`);
  };

  const handleLike = async () => {
    if (status === 'unauthenticated') {
      handleAuthRequired();
      return;
    }

    try {
      const response = await fetch(`/api/startups/${startupId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        if (hasDisliked) {
          setDislikes((prev) => prev - 1);
          setHasDisliked(false);
        }
        if (!hasLiked) {
          setLikes((prev) => prev + 1);
          setHasLiked(true);
        }
      }
    } catch (error) {
      console.error('Error liking startup:', error);
    }
  };

  const handleDislike = async () => {
    if (status === 'unauthenticated') {
      handleAuthRequired();
      return;
    }

    try {
      const response = await fetch(`/api/startups/${startupId}/dislike`, {
        method: 'POST',
      });

      if (response.ok) {
        if (hasLiked) {
          setLikes((prev) => prev - 1);
          setHasLiked(false);
        }
        if (!hasDisliked) {
          setDislikes((prev) => prev + 1);
          setHasDisliked(true);
        }
      }
    } catch (error) {
      console.error('Error disliking startup:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (status === 'unauthenticated') {
      handleAuthRequired();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/startups/${startupId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          className={cn(hasLiked && 'bg-lime-400/20 text-lime-400')}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          {likes}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDislike}
          className={cn(hasDisliked && 'bg-red-400/20 text-red-400')}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          {dislikes}
        </Button>
      </div>

      <div className="space-y-4">
        {status === 'authenticated' ? (
          <div className="flex gap-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleComment}
              disabled={isSubmitting || !newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAuthRequired}
          >
            Sign in to comment
          </Button>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.image || ''} />
                <AvatarFallback>
                  {comment.user.name?.[0] || comment.user.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {comment.user.name || comment.user.email}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
