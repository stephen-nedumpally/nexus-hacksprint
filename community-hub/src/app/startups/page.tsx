'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import { ViewOpportunitiesDialog } from '@/components/startups/view-opportunities-dialog';

interface Startup {
  id: string;
  name: string;
  description: string;
  domain: string[];
  logo?: string;
  teamSize: number;
  foundedYear: number;
  positions: {
    id: string;
    title: string;
    type: string;
    location: string;
    requirements: string[];
  }[];
  likes: { id: string; userId: string }[];
  dislikes: { id: string; userId: string }[];
  comments: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default function StartupsPage() {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetch('/api/startups')
      .then((res) => res.json())
      .then((data) => {
        setStartups(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching startups:', error);
        setLoading(false);
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, startupId: string) => {
    if (!cardRefs.current[startupId]) return;
    
    const rect = cardRefs.current[startupId]!.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-48 bg-white/5 rounded" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Startups</h1>
            <p className="text-muted-foreground">
              Browse and connect with innovative startups
            </p>
          </div>
          <Link href="/startups/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Startup
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {startups.map((startup: Startup) => (
            <Card 
              key={startup.id} 
              ref={el => cardRefs.current[startup.id] = el}
              className="group relative overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm hover:border-lime-400/50 transition-all duration-300"
              onMouseMove={(e) => handleMouseMove(e, startup.id)}
              onMouseEnter={() => setHoveredCardId(startup.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
              } as React.CSSProperties}
            >
              {hoveredCardId === startup.id && (
                <div 
                  className="absolute pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle 100px at var(--mouse-x) var(--mouse-y), rgba(163, 230, 53, 0.15), transparent 100%)',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
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
                        <div className="text-xl font-bold text-lime-400">
                          {startup.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{startup.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{startup.teamSize} team members</span>
                        <span>•</span>
                        <span>Founded {startup.foundedYear || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {startup.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {startup.domain.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-lime-400/10 hover:bg-lime-400/20 text-lime-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {startup.likes?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {startup.dislikes?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {startup.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/startups/${startup.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-black text-lime-400 border border-lime-400 hover:bg-lime-400/10"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 bg-lime-400 text-black hover:bg-lime-400/90"
                    onClick={() => {
                      setSelectedStartup(startup);
                      setDialogOpen(true);
                    }}
                  >
                    View Opportunities
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ViewOpportunitiesDialog
        startup={selectedStartup}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </main>
  );
}
