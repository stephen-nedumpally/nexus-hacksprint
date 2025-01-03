import { StudyGroupList } from "@/components/study-groups/StudyGroupList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudyGroupsPage() {
  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Study Groups</h1>
          <p className="text-gray-400 max-w-2xl">
          Join a study group or create your own learning community
          </p>
        </div>
   
        <Button asChild>
          <Link href="/study-groups/create">Create Group</Link>
        </Button>
      </div>
      <StudyGroupList />
    </main>
  );
}
