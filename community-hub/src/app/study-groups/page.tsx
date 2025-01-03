import { StudyGroupList } from "@/components/study-groups/StudyGroupList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudyGroupsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-muted-foreground">
            Join a study group or create your own learning community
          </p>
        </div>
        <Button asChild>
          <Link href="/study-groups/create">Create Group</Link>
        </Button>
      </div>
      <StudyGroupList />
    </div>
  );
}
