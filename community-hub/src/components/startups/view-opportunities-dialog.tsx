'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Startup } from '@/types/startup';

interface ViewOpportunitiesDialogProps {
  startup: Startup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPositionId?: string;
}

export function ViewOpportunitiesDialog({ 
  startup, 
  open, 
  onOpenChange,
  selectedPositionId 
}: ViewOpportunitiesDialogProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(
    selectedPositionId 
      ? startup.positions.findIndex(p => p.id === selectedPositionId).toString()
      : "0"
  );

  const handleApply = async (positionId: string) => {
    if (status === 'unauthenticated') {
      onOpenChange(false); // Close the dialog
      router.push(`/auth/signin?callbackUrl=/startups/${startup.id}`);
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId: startup.id,
          positionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply');
      }

      // Close dialog after successful application
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Open Positions at {startup.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-3 mb-4">
            {startup.positions.map((position, index) => (
              <TabsTrigger key={position.id} value={index.toString()}>
                {position.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {startup.positions.map((position, index) => (
            <TabsContent key={position.id} value={index.toString()}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{position.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{position.description}</p>
                    </div>
                    <Button 
                      className="bg-lime-400 text-black hover:bg-lime-400/90"
                      onClick={() => handleApply(position.id)}
                    >
                      {status === 'unauthenticated' ? 'Sign in to Apply' : 'Apply Now'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
