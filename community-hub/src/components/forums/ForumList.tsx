'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const forums = [
  {
    id: 'discord-general',
    name: 'General Discussion',
    platform: 'Discord',
    description: 'General discussion about programming and technology',
    activeMembers: 150,
    totalMembers: 500,
    link: 'https://discord.gg/example',
  },
  {
    id: 'discord-help',
    name: 'Help & Support',
    platform: 'Discord',
    description: 'Get help with coding problems and technical issues',
    activeMembers: 75,
    totalMembers: 300,
    link: 'https://discord.gg/example-help',
  },
  {
    id: 'googlechat-projects',
    name: 'Project Collaboration',
    platform: 'Google Chat',
    description: 'Find partners and collaborate on projects',
    activeMembers: 45,
    totalMembers: 200,
    link: 'https://chat.google.com/example',
  },
];

export function ForumList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {forums.map((forum) => (
        <Card key={forum.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {forum.name}
              <span className="text-sm font-normal text-muted-foreground">
                ({forum.platform})
              </span>
            </CardTitle>
            <CardDescription>{forum.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-medium">Active Members</p>
                <p className="text-muted-foreground">{forum.activeMembers}</p>
              </div>
              <div>
                <p className="font-medium">Total Members</p>
                <p className="text-muted-foreground">{forum.totalMembers}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => window.open(forum.link, '_blank')}
            >
              Join Channel
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
