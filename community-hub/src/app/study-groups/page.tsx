import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudyGroups from "@/components/study-groups/study-groups";

export default async function StudyGroupsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Study Groups</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join study groups to learn and grow together. Choose from various topics and skill levels.
          </p>
        </div>
        <StudyGroups />
      </div>
    </main>
  );
}
