import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralForums } from "@/components/forums/ForumList";
import { StartupForums } from "@/components/forums/startup-forums";
import { ProjectForums } from "@/components/forums/project-forums";
import { CourseForums } from "@/components/forums/course-forums";

export default function ForumsPage() {
  return (
    <main>
      <div className="container py-6 mt-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Forums</h1>
          <p className="text-muted-foreground">
            Join discussions, ask questions, and share your knowledge
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6">
            <GeneralForums />
          </TabsContent>
          <TabsContent value="startups" className="mt-6">
            <StartupForums />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectForums />
          </TabsContent>
          <TabsContent value="courses" className="mt-6">
            <CourseForums />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
