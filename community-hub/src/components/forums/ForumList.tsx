'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const forums = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'General discussion about technology, programming, and more',
    count: 150,
  },
  {
    id: 'introductions',
    name: 'Introductions',
    description: 'Introduce yourself to the community',
    count: 75,
  },
  {
    id: 'help',
    name: 'Help & Support',
    description: 'Get help with technical issues and questions',
    count: 120,
  },
];

export function GeneralForums() {
  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <Link key={forum.id} href={`/forums/${forum.id}`}>
          <Card className="hover:border-primary transition-colors mt-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {forum.name}
              </CardTitle>
              <Badge variant="secondary">{forum.count} topics</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {forum.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
