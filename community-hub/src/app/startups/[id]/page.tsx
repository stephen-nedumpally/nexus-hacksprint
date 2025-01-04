'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageSquare, Reply } from 'lucide-react';
import Link from 'next/link';
import { formatNumber, formatDate } from '@/lib/utils';
import { Startup } from '@/types/startup';
import { ViewOpportunitiesDialog } from '@/components/startups/view-opportunities-dialog';
import { useToast } from "@/components/ui/use-toast";

export default function StartupDetailsPage() {
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | undefined>();
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const fetchStartupData = async (startupId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/startups/${startupId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch startup');
      setStartup(data);
    } catch (error) {
      console.error('Error fetching startup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch startup details"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const startupId = path.split('/').pop();
    if (!startupId) return;
    fetchStartupData(startupId);
  }, []);

  const handleAuthAction = (action: string) => {
    if (!session) {
      signIn();
      return;
    }
  };

  const handleLike = async () => {
    if (!startup || !session) {
      signIn();
      return;
    }

    try {
      const res = await fetch(`/api/startups/${startup.id}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to like startup');
      
      const updatedStartup = await res.json();
      setStartup(updatedStartup);
      toast({
        title: "Success",
        description: "Liked startup successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like startup",
      });
    }
  };

  const handleDislike = async () => {
    if (!startup || !session) {
      signIn();
      return;
    }

    try {
      const res = await fetch(`/api/startups/${startup.id}/dislike`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to dislike startup');
      
      const updatedStartup = await res.json();
      setStartup(updatedStartup);
      toast({
        title: "Success",
        description: "Disliked startup successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to dislike startup",
      });
    }
  };

  const handleComment = async () => {
    if (!startup || !session) {
      signIn();
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a comment",
      });
      return;
    }

    try {
      const res = await fetch(`/api/startups/${startup.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      
      const updatedStartup = await res.json();
      setStartup(updatedStartup);
      setComment('');
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      });
    }
  };

  const handleReply = async (commentId: string) => {
    if (!startup || !session) {
      signIn();
      return;
    }

    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a reply",
      });
      return;
    }

    try {
      const res = await fetch(`/api/startups/${startup.id}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });
      if (!res.ok) throw new Error('Failed to add reply');
      
      const updatedStartup = await res.json();
      setStartup(updatedStartup);
      setReplyTo(null);
      setReplyContent('');
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add reply",
      });
    }
  };

  const handleApply = (positionId: string) => {
    if (status === 'unauthenticated') {
      signIn();
      return;
    }
    setSelectedPositionId(positionId);
    setShowOpportunities(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Startup not found</h1>
        <Link href="/startups">
          <Button variant="outline" className="text-lime-400 border-lime-400 hover:bg-lime-400/10">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </Button>
        </Link>
      </div>
    );
  }

  const userHasLiked = startup.likes?.some(like => like.userId === session?.user?.id);
  const userHasDisliked = startup.dislikes?.some(dislike => dislike.userId === session?.user?.id);

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/startups">
            <Button variant="outline" className="text-lime-400 border-lime-400 hover:bg-lime-400/10">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Startups
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{startup.name}</h1>
              <div className="flex items-center gap-2 text-gray-400">
                {startup.domain.map((domain) => (
                  <Badge key={domain} variant="outline">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
            <Button 
              className="bg-lime-400 text-black hover:bg-lime-400/90"
              onClick={() => {
                setShowOpportunities(true);
                setSelectedPositionId(undefined);
              }}
            >
              View All Positions
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Founded</p>
              <p className="text-2xl font-semibold">{formatDate(startup.founded)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-semibold">{startup.teamSize}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Open Positions</p>
              <p className="text-2xl font-semibold">{startup.positions?.length}</p>
            </div>
          </div>

          {/* Interaction Stats */}
          <div className="flex items-center gap-8">
            <Button 
              variant="ghost" 
              className={`flex items-center gap-2 ${userHasLiked ? 'text-lime-400' : 'text-gray-400 hover:text-lime-400'}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="font-medium">{formatNumber(startup.likes?.length)}</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex items-center gap-2 ${userHasDisliked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-5 w-5" />
              <span className="font-medium">{formatNumber(startup.dislikes?.length)}</span>
            </Button>
            <div className="flex items-center gap-2 text-blue-400">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{formatNumber(startup.comments?.length)}</span>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
                <p className="text-gray-400">{startup.description}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Problem</h2>
                <p className="text-gray-400">{startup.problem}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Solution</h2>
                <p className="text-gray-400">{startup.solution}</p>
              </section>

              {/* Comments Section */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Comments</h2>
                
                {/* Add Comment */}
                <div className="mb-6 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-black/50 border-white/10 text-white"
                  />
                  <Button 
                    onClick={handleComment}
                    className="bg-lime-400 text-black hover:bg-lime-400/90"
                  >
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {startup.comments?.map((comment) => (
                    <Card key={comment.id} className="bg-black/50 border border-white/10">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{comment.user.name}</span>
                            <span className="text-sm text-gray-400">{formatDate(comment.createdAt)}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-blue-400"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                        <p className="text-gray-400">{comment.content}</p>

                        {/* Reply Form */}
                        {replyTo === comment.id && (
                          <div className="mt-4 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="bg-black/50 border-white/10 text-white"
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleReply(comment.id)}
                                className="bg-lime-400 text-black hover:bg-lime-400/90"
                              >
                                Post Reply
                              </Button>
                              <Button 
                                variant="ghost"
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyContent('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="mt-4 pl-6 space-y-4 border-l border-white/10">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{reply.user.name}</span>
                                  <span className="text-sm text-gray-400">{formatDate(reply.createdAt)}</span>
                                </div>
                                <p className="text-gray-400">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <Card className="bg-black/50 border border-white/10">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Market & Traction</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Market Size</p>
                      <p className="text-white">{startup.market}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Traction</p>
                      <p className="text-white">{startup.traction}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Funding</p>
                      <p className="text-white">{startup.funding}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/50 border border-white/10">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Company Details</h3>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium">{formatDate(startup.founded)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team Size</p>
                      <p className="font-medium">{startup.teamSize || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {startup.website && (
                <Button 
                  className="w-full bg-black text-lime-400 border border-lime-400 hover:bg-lime-400/10"
                  variant="outline"
                  onClick={() => window.open(startup.website, '_blank')}
                >
                  Visit Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ViewOpportunitiesDialog
        startup={startup}
        open={showOpportunities}
        onOpenChange={setShowOpportunities}
        selectedPositionId={selectedPositionId}
      />
    </main>
  );
}
