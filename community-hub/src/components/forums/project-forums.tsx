import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ProjectForums() {
  const forums = [
    {
      id: "collaboration",
      name: "Project Collaboration",
      description: "Find teammates and collaborators for your projects",
      count: 110,
    },
    {
      id: "showcase",
      name: "Project Showcase",
      description: "Share and showcase your projects",
      count: 95,
    },
    {
      id: "code-review",
      name: "Code Review",
      description: "Get feedback on your code and implementation",
      count: 75,
    },
    {
      id: "hackathons",
      name: "Hackathons",
      description: "Discuss hackathon projects and find teammates",
      count: 60,
    },
  ];

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <Link key={forum.id} href={`/forums/projects/${forum.id}`}>
          <Card className="hover:border-primary transition-colors">
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
