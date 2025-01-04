'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import type { Startup } from '@/types/startup';

interface ViewOpportunitiesDialogProps {
  startup: Startup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiresVerification?: boolean;
  onApply: () => void;
}

export function ViewOpportunitiesDialog({
  startup,
  open,
  onOpenChange,
  requiresVerification,
  onApply,
}: ViewOpportunitiesDialogProps) {
  const [applying, setApplying] = useState(false);
  const { toast } = useToast();

  async function handleApply(positionId) {
    try {
      setApplying(true);
      await applyToPosition(positionId);
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApplying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Opportunities at {startup.name}
          </DialogTitle>
        </DialogHeader>

        {requiresVerification && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete verification to apply for positions
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {startup.positions.map((position) => (
            <Card
              key={position.id}
              className="p-4 border border-white/10 bg-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {position.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {position.requirements?.experience} years experience
                  </p>
                </div>
                <Badge variant="outline" className="border-lime-400/50 text-lime-400">
                  {position.applications?.length || 0} applicants
                </Badge>
              </div>

              <p className="text-gray-400 mb-4">{position.description}</p>

              {position.requirements && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {position.requirements.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-white/5 text-white"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {position.requirements.education && (
                    <p className="text-sm text-gray-400">
                      Education: {position.requirements.education}
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={() => handleApply(position.id)}
                className="w-full mt-4 bg-lime-400 text-black hover:bg-lime-400/90"
                disabled={requiresVerification || applying}
              >
                Apply Now
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
