'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { Startup } from '@/types/startup';

interface ViewOpportunitiesDialogProps {
  startup: Startup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPositionId?: string;
  onApplicationSuccess?: () => Promise<void>;
}

export function ViewOpportunitiesDialog({ 
  startup, 
  open, 
  onOpenChange,
  selectedPositionId,
  onApplicationSuccess
}: ViewOpportunitiesDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selected tab when selectedPositionId changes
  useEffect(() => {
    if (startup && selectedPositionId) {
      const index = startup.positions.findIndex(p => p.id === selectedPositionId);
      setSelectedTab(index >= 0 ? index.toString() : "0");
    } else {
      setSelectedTab("0");
    }
  }, [selectedPositionId, startup]);

  const hasApplied = (position: any) => {
    return position.applications?.some((app: any) => 
      app.userId === session?.user?.id
    );
  };

  const getApplicationStatus = (position: any) => {
    const application = position.applications?.find((app: any) => 
      app.userId === session?.user?.id
    );
    return application?.status;
  };

  const handleApply = async (position: any) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply.",
        variant: "destructive",
      });
      return;
    }

    if (!session.user.verified) {
      toast({
        title: "Verification Required",
        description: "Please complete verification to apply for positions.",
        variant: "destructive",
      });
      router.push("/verify");
      return;
    }

    if (!startup) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Startup information not available"
      });
      return;
    }

    // Check if already applied
    if (hasApplied(position)) {
      toast({
        title: "Already Applied",
        description: `You have already applied for the ${position.title} position. Current status: ${getApplicationStatus(position)}`,
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId: startup.id,
          positionId: position.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast({
        title: "Application Submitted",
        description: `Successfully applied for ${position.title}`,
        duration: 3000,
      });

      if (onApplicationSuccess) {
        await onApplicationSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!startup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Opportunities at {startup.name}</DialogTitle>
        </DialogHeader>
        
        {startup.positions?.length > 0 ? (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full">
              {startup.positions.map((position, index) => (
                <TabsTrigger
                  key={position.id}
                  value={index.toString()}
                  className="flex-1"
                >
                  {position.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {startup.positions.map((position, index) => (
              <TabsContent key={position.id} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{position.title}</span>
                      <Badge variant="secondary">
                        {position.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Location</h4>
                      <p className="text-sm text-muted-foreground">{position.location}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {position.requirements.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Responsibilities</h4>
                      <p className="text-sm text-muted-foreground">{position.responsibilities}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Qualifications</h4>
                      <p className="text-sm text-muted-foreground">{position.qualifications}</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold">Equity</h4>
                        <p className="text-sm text-muted-foreground">{position.equity}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Stipend</h4>
                        <p className="text-sm text-muted-foreground">{position.stipend}</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleApply(position)}
                      disabled={isSubmitting || hasApplied(position)}
                    >
                      {hasApplied(position) 
                        ? `Applied - ${getApplicationStatus(position)}`
                        : isSubmitting 
                          ? "Applying..." 
                          : "Apply Now"
                      }
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No open positions at the moment.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
