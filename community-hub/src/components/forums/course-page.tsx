'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format, addDays, parseISO } from "date-fns";
import SubmissionCalendar from "./submission-calendar";

interface CoursePageProps {
  courseId: string;
  courseName: string;
}

interface CourseDetails {
  id: string;
  name: string;
  quizDates: {
    quiz1?: string;
    quiz2?: string;
    endTerm: string;
  };
  coursework: {
    week: number;
    deadline: string;
    description: string;
  }[];
  grading: {
    components: {
      name: string;
      weight: number;
      description: string;
    }[];
    eligibility: string[];
  };
}

interface Score {
  assignmentScores: number[];
  quizScores: {
    quiz1?: number;
    quiz2?: number;
  };
  currentGAA?: number;
}

export default function CoursePage({ courseId, courseName }: CoursePageProps) {
  const { data: session } = useSession();
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [scores, setScores] = useState<Score | null>(null);
  const [upcomingWork, setUpcomingWork] = useState<any[]>([]);

  // Create calendar events
  const calendarEvents = courseDetails ? [
    // Content release dates
    {
      date: parseISO("2025-01-10"),
      type: 'content-release' as const,
      title: 'Week 1 Content Release'
    },
    {
      date: parseISO("2025-01-17"),
      type: 'content-release' as const,
      title: 'Week 2 Content Release'
    },
    {
      date: parseISO("2025-01-24"),
      type: 'content-release' as const,
      title: 'Week 3 Content Release'
    },
    {
      date: parseISO("2025-01-31"),
      type: 'content-release' as const,
      title: 'Week 4 Content Release'
    },
    {
      date: parseISO("2025-02-07"),
      type: 'content-release' as const,
      title: 'Week 5 Content Release'
    },
    {
      date: parseISO("2025-02-14"),
      type: 'content-release' as const,
      title: 'Week 6 Content Release'
    },
    {
      date: parseISO("2025-02-21"),
      type: 'content-release' as const,
      title: 'Week 7 Content Release'
    },
    {
      date: parseISO("2025-02-28"),
      type: 'content-release' as const,
      title: 'Week 8 Content Release'
    },
    {
      date: parseISO("2025-03-07"),
      type: 'content-release' as const,
      title: 'Week 9 Content Release'
    },
    {
      date: parseISO("2025-03-14"),
      type: 'content-release' as const,
      title: 'Week 10 Content Release'
    },
    {
      date: parseISO("2025-03-21"),
      type: 'content-release' as const,
      title: 'Week 11 Content Release'
    },
    {
      date: parseISO("2025-03-21"),
      type: 'content-release' as const,
      title: 'Week 12 Content Release'
    },
    // Weekly submissions
    ...courseDetails.coursework.map(work => ({
      date: parseISO(work.deadline),
      type: 'submission' as const,
      title: `${work.description} Due`
    })),
    // Quizzes
    ...(courseDetails.quizDates.quiz1 ? [{
      date: parseISO(courseDetails.quizDates.quiz1),
      type: 'quiz' as const,
      title: 'Quiz 1'
    }] : []),
    ...(courseDetails.quizDates.quiz2 ? [{
      date: parseISO(courseDetails.quizDates.quiz2),
      type: 'quiz' as const,
      title: 'Quiz 2'
    }] : []),
    // End term
    {
      date: parseISO(courseDetails.quizDates.endTerm),
      type: 'endterm' as const,
      title: 'End Term Exam'
    }
  ] : [];

  useEffect(() => {
    // Mock data for now
    const mockCourse: CourseDetails = {
      id: courseId,
      name: courseName,
      quizDates: {
        quiz1: "2025-02-23",
        quiz2: "2025-03-16",
        endTerm: "2025-04-13"
      },
      coursework: [
        {
          week: 1,
          deadline: "2025-01-22",
          description: "Week 1 Assignment"
        },
        {
          week: 2,
          deadline: "2025-01-29",
          description: "Week 2 Assignment"
        },
        {
          week: 3,
          deadline: "2025-02-05",
          description: "Week 3 Assignment"
        },
        {
          week: 4,
          deadline: "2025-02-12",
          description: "Week 4 Assignment"
        },
        {
          week: 5,
          deadline: "2025-02-19",
          description: "Week 5 Assignment"
        },
        {
          week: 6,
          deadline: "2025-02-26",
          description: "Week 6 Assignment"
        },
        {
          week: 7,
          deadline: "2025-03-05",
          description: "Week 7 Assignment"
        },
        {
          week: 8,
          deadline: "2025-03-12",
          description: "Week 8 Assignment"
        },
        {
          week: 9,
          deadline: "2025-03-19",
          description: "Week 9 Assignment"
        },
        {
          week: 10,
          deadline: "2025-03-26",
          description: "Week 10 Assignment"
        },
        {
          week: 11,
          deadline: "2025-04-02",
          description: "Week 11 Assignment"
        },
        {
          week: 12,
          deadline: "2025-04-09",
          description: "Week 12 Assignment"
        }
      ],
      grading: {
        components: [
          {
            name: "GAA",
            weight: 10,
            description: "Average score in First 10 weekly graded assignments"
          },
          {
            name: "Quiz",
            weight: 20,
            description: "Best of Quiz 1 and Quiz 2"
          },
          {
            name: "Final Exam",
            weight: 70,
            description: "End term examination"
          }
        ],
        eligibility: [
          "Average of best 5 out of first 7 weekly assignments >= 40/100",
          "Attendance in one of the 2 quizzes",
          "Must attend end term exam"
        ]
      }
    };
    setCourseDetails(mockCourse);
  }, [courseId, courseName]);

  useEffect(() => {
    // Calculate upcoming coursework (next 10 days)
    if (courseDetails) {
      const today = new Date("2025-01-05"); // Using the provided current date
      const tenDaysFromNow = addDays(today, 10);
      
      const upcoming = courseDetails.coursework.filter(work => {
        const deadline = new Date(work.deadline);
        return deadline >= today && deadline <= tenDaysFromNow;
      });

      setUpcomingWork(upcoming);
    }
  }, [courseDetails]);

  if (!courseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl mt-10 font-bold">{courseDetails.name}</h1>

      {/* Upcoming Coursework Section */}
      <Card>
        <CardHeader>
          <CardTitle>Coursework for Next 10 Days</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingWork.length > 0 ? (
            <ul className="space-y-2">
              {upcomingWork.map((work, index) => (
                <li key={index} className="flex justify-between">
                  <span>Week {work.week}: {work.description}</span>
                  <span className="text-muted-foreground">
                    Due: {format(new Date(work.deadline), "MMM d, yyyy")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming coursework in the next 10 days</p>
          )}

          {courseDetails && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Submission Calendar</h3>
              <SubmissionCalendar
                events={calendarEvents}
                startDate={parseISO("2025-01-01")}
                endDate={parseISO("2025-04-30")}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {courseDetails.quizDates.quiz1 && (
              <div className="flex justify-between">
                <span>Quiz 1</span>
                <span>{format(new Date(courseDetails.quizDates.quiz1), "MMMM d, yyyy")}</span>
              </div>
            )}
            {courseDetails.quizDates.quiz2 && (
              <div className="flex justify-between">
                <span>Quiz 2</span>
                <span>{format(new Date(courseDetails.quizDates.quiz2), "MMMM d, yyyy")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>End Term</span>
              <span>{format(new Date(courseDetails.quizDates.endTerm), "MMMM d, yyyy")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grading Components */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {courseDetails.grading.components.map((component, index) => (
                <div key={index} className="flex justify-between">
                  <span>{component.name} ({component.weight}%)</span>
                  <span className="text-muted-foreground">{component.description}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Eligibility Criteria:</h4>
              <ul className="list-disc list-inside space-y-1">
                {courseDetails.grading.eligibility.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Scores Section */}
      {scores && (
        <Card>
          <CardHeader>
            <CardTitle>Your Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scores.currentGAA && (
                <div className="flex justify-between">
                  <span>Current GAA</span>
                  <span>{scores.currentGAA.toFixed(2)}</span>
                </div>
              )}
              {scores.quizScores.quiz1 !== undefined && (
                <div className="flex justify-between">
                  <span>Quiz 1</span>
                  <span>{scores.quizScores.quiz1}</span>
                </div>
              )}
              {scores.quizScores.quiz2 !== undefined && (
                <div className="flex justify-between">
                  <span>Quiz 2</span>
                  <span>{scores.quizScores.quiz2}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
