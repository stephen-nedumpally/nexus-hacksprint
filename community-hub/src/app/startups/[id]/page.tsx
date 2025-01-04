'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';
import { Startup } from '@/types/startup';
import { ViewOpportunitiesDialog } from '@/components/startups/view-opportunities-dialog';
import { Textarea } from '@/components/ui/textarea';

export default function StartupDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetch(`/api/startups/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStartup(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching startup:', error);
        setLoading(false);
      });
  }, [params.id]);

  const handleApply = (positionId: string) => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/startups/${params.id}`);
      return;
    }
    setSelectedPosition(positionId);
  };

  const handleLike = async () => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/startups/${params.id}`);
      return;
    }

    try {
      const response = await fetch(`/api/startups/${params.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to like');

      const updatedStartup = await response.json();
      setStartup(updatedStartup);
    } catch (error) {
      console.error('Error liking startup:', error);
    }
  };

  const handleDislike = async () => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/startups/${params.id}`);
      return;
    }

    try {
      const response = await fetch(`/api/startups/${params.id}/dislike`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to dislike');

      const updatedStartup = await response.json();
      setStartup(updatedStartup);
    } catch (error) {
      console.error('Error disliking startup:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/startups/${params.id}`);
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/startups/${params.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error('Failed to comment');

      const updatedStartup = await response.json();
      setStartup(updatedStartup);
      setComment('');
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold">Startup not found</h3>
            <p className="text-muted-foreground">The startup you're looking for doesn't exist.</p>
            <Link href="/startups" className="mt-4 inline-block">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Startups
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasLiked = startup.likes?.some(like => like.userId === session?.user?.id);
  const hasDisliked = startup.dislikes?.some(dislike => dislike.userId === session?.user?.id);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/startups" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold">{startup.name}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium">Domains</h3>
                  <div className="flex gap-2 mt-2">
                    {startup.domain.map((domain) => (
                      <Badge key={domain} variant="outline">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
                {startup.website && (
                  <div>
                    <h3 className="font-medium">Website</h3>
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-400 hover:underline mt-2 block"
                    >
                      {startup.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Problem & Solution */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Problem</h3>
                <p className="text-muted-foreground">{startup.problem}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Solution</h3>
                <p className="text-muted-foreground">{startup.solution}</p>
              </div>
            </div>

            <Separator />

            {/* Market & Traction */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Market Size</h3>
                <p className="text-muted-foreground">
                  ${formatNumber(startup.marketSize)}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Current Traction</h3>
                <p className="text-muted-foreground">{startup.traction}</p>
              </div>
            </div>

            <Separator />

            {/* Funding */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Funding</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-medium">Stage</h3>
                  <p className="text-muted-foreground mt-2">{startup.fundingStage}</p>
                </div>
                <div>
                  <h3 className="font-medium">Amount Raised</h3>
                  <p className="text-muted-foreground mt-2">
                    ${formatNumber(startup.amountRaised)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Seeking</h3>
                  <p className="text-muted-foreground mt-2">
                    ${formatNumber(startup.seekingAmount)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Community Engagement */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Community Engagement</h2>
              <div className="flex gap-4 mb-6">
                <Button
                  variant={hasLiked ? "default" : "outline"}
                  onClick={handleLike}
                  className="flex gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{startup.likes?.length || 0}</span>
                </Button>
                <Button
                  variant={hasDisliked ? "default" : "outline"}
                  onClick={handleDislike}
                  className="flex gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{startup.dislikes?.length || 0}</span>
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{startup.comments?.length || 0}</span>
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <form onSubmit={handleComment} className="space-y-2">
                  <Textarea
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={status === 'unauthenticated'}
                  />
                  <Button
                    type="submit"
                    disabled={submittingComment || status === 'unauthenticated'}
                    className="bg-lime-400 text-black hover:bg-lime-400/90"
                  >
                    {status === 'unauthenticated' ? 'Sign in to Comment' : 'Post Comment'}
                  </Button>
                </form>

                <div className="space-y-4">
                  {startup.comments?.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-muted-foreground">{comment.content}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Open Positions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Open Positions</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {startup.positions.map((position) => (
                  <Card key={position.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{position.title}</CardTitle>
                          <CardDescription>{position.description}</CardDescription>
                        </div>
                        <Button 
                          className="bg-lime-400 text-black hover:bg-lime-400/90"
                          onClick={() => handleApply(position.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {position.requirements.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Experience</h4>
                          <p>{position.requirements.experience} years</p>
                        </div>
                        {position.requirements.education && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Education</h4>
                            <p>{position.requirements.education}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPosition && (
        <ViewOpportunitiesDialog
          startup={startup}
          open={!!selectedPosition}
          onOpenChange={() => setSelectedPosition(null)}
          selectedPositionId={selectedPosition}
        />
      )}
    </div>
  );
}
