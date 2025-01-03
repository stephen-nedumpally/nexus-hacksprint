import { StartupList } from "@/components/startups/StartupList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StartupsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Startups</h1>
          <p className="text-muted-foreground">
            Find exciting startup projects or create your own
          </p>
        </div>
        <Button asChild>
          <Link href="/startups/create">Create Startup</Link>
        </Button>
      </div>
      <StartupList />
    </div>
  );
}
