'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { applyToPosition } from '@/lib/api/startups';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import type { Startup } from '@/types/startup';

interface ViewOpportunitiesDialogProps {
  startup: Startup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewOpportunitiesDialog({ startup, open, onOpenChange }: ViewOpportunitiesDialogProps) {
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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400 font-bold">
              {startup.name[0]}
            </div>
            {startup.name}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{startup.domain.join(' • ')}</span>
            {startup.website && (
              <>
                <span>•</span>
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:underline"
                >
                  Visit Website
                </a>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {startup.positions.map((position) => (
            <div 
              key={position.id}
              className="rounded-lg border border-white/10 p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {position.title}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {position.description}
                  </p>
                </div>
                <Button
                  onClick={() => handleApply(position.id)}
                  disabled={applying}
                  className="bg-lime-400 text-black hover:bg-lime-400/90"
                >
                  Apply Now
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Code className="w-4 h-4" />
                    <span>Required Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {position.requirements.skills.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="outline" 
                        className="border-lime-400/50 text-lime-400"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Experience</span>
                  </div>
                  <p className="text-white">
                    {position.requirements.experience < 12
                      ? `${position.requirements.experience} months`
                      : `${Math.floor(position.requirements.experience / 12)} years`}
                  </p>
                </div>

                {position.requirements.education && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>Education</span>
                    </div>
                    <p className="text-white">
                      {position.requirements.education}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {startup.positions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No open positions at the moment. Check back later!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
