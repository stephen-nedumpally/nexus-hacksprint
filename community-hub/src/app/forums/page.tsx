import { ForumList } from "@/components/forums/ForumList";

export default function ForumsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Forums</h1>
        <p className="text-muted-foreground">
          Join our community discussion channels
        </p>
      </div>
      <ForumList />
    </div>
  );
}
