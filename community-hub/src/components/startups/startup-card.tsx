'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { ViewOpportunitiesDialog } from './view-opportunities-dialog';
import type { Startup } from '@/types/startup';

interface StartupCardProps {
  startup: Startup;
  requiresVerification: boolean;
  onApply: () => void;
}

export function StartupCard({ startup, requiresVerification, onApply }: StartupCardProps) {
  const [showOpportunities, setShowOpportunities] = useState(false);

  return (
    <>
      <Card 
        className="group relative overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm hover:border-lime-400/50 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-lime-400/10 flex items-center justify-center">
                {startup.logo ? (
                  <Image
                    src={startup.logo}
                    alt={startup.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400 font-semibold">
                    {startup.name[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{startup.name}</h3>
                <p className="text-sm text-gray-400">{startup.domain.join(' • ')}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-lime-400/50 text-lime-400">
              {startup.positions.length > 0 ? 'Hiring' : 'Coming Soon'}
            </Badge>
          </div>

          <p className="text-gray-400 mb-6 line-clamp-3">
            {startup.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Open Positions</span>
              <span className="text-white font-medium">{startup.positions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Team Size</span>
              <span className="text-white font-medium">{startup.teamSize}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Founded</span>
              <span className="text-white font-medium">{startup.foundedYear}</span>
            </div>
          </div>

          <Button 
            className="w-full mt-6 bg-lime-400 text-black hover:bg-lime-400/90"
            onClick={() => setShowOpportunities(true)}
          >
            View Opportunities
          </Button>
        </div>
      </Card>

      {showOpportunities && (
        <ViewOpportunitiesDialog
          startup={startup}
          open={showOpportunities}
          onOpenChange={setShowOpportunities}
          requiresVerification={requiresVerification}
          onApply={onApply}
        />
      )}
    </>
  );
}
