import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function StartupForums() {
  const forums = [
    {
      id: "ideation",
      name: "Startup Ideation",
      description: "Discuss and validate startup ideas",
      count: 85,
    },
    {
      id: "tech-stack",
      name: "Tech Stack Discussion",
      description: "Discuss technology choices for your startup",
      count: 120,
    },
    {
      id: "funding",
      name: "Funding & Investment",
      description: "Discuss funding opportunities and investment strategies",
      count: 65,
    },
    {
      id: "growth",
      name: "Growth & Marketing",
      description: "Share and learn about growth strategies",
      count: 95,
    },
  ];

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <Link key={forum.id} href={`/forums/startups/${forum.id}`}>
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
