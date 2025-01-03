'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useQuery } from '@tanstack/react-query';
import { fetchStartups } from '@/lib/api/startups';
import { CreateStartupForm } from '@/components/startups/create-startup-form';
import { ViewOpportunitiesDialog } from '@/components/startups/view-opportunities-dialog';
import type { Startup } from '@/types/startup';

export default function StartupsPage() {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const { data: startups, isLoading } = useQuery<Startup[]>({
    queryKey: ['startups'],
    queryFn: fetchStartups,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Startup Opportunities</h1>
            <p className="text-gray-400 max-w-2xl">
              Discover innovative startups and projects that are shaping the future. Join them in their journey and be part of something extraordinary.
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Startup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Startup</DialogTitle>
              </DialogHeader>
              <CreateStartupForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {startups?.map((startup: Startup) => (
            <Card 
              key={startup.id} 
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
                <p className="text-gray-400 mb-6">
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
                  onClick={() => setSelectedStartup(startup)}
                >
                  View Opportunities
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedStartup && (
        <ViewOpportunitiesDialog
          startup={selectedStartup}
          open={!!selectedStartup}
          onOpenChange={() => setSelectedStartup(null)}
        />
      )}
    </main>
  );
}
