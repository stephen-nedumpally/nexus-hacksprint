'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string[];
  memberCount: number;
}

export function StudyGroupList() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/study-groups')
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching study groups:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading study groups...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No study groups found</h3>
        <p className="text-muted-foreground">Create a new study group to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Type</h4>
                <Badge variant="secondary">{group.type}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Level</h4>
                <div className="flex flex-wrap gap-2">
                  {group.level.map((level) => (
                    <Badge key={level} variant="outline">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Members</h4>
                <p className="text-sm text-muted-foreground">{group.memberCount} members</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/study-groups/${group.id}`}>View Group</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
