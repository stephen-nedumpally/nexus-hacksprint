import { ForumList } from "@/components/forums/ForumList";

export default function ForumsPage() {
  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Forums</h1>
        <p className="text-muted-foreground">
          Join our community discussion channels
        </p>
      </div>
      <ForumList />
    </div>
    </main>
  );
}
