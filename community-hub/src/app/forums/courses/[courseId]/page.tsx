import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursePage from "@/components/forums/course-page";
import { prisma } from "@/lib/prisma";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function Page({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get course details from database
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId
    }
  });

  if (!course) {
    redirect("/forums/courses");
  }

  return <CoursePage courseId={params.courseId} courseName={course.name} />;
}
