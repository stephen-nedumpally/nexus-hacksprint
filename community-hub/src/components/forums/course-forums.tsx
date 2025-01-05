'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type Course = {
  id: string;
  name: string;
  code: string;
  level: string;
  whatsappLink: string;
  discordLink: string;
  _count: {
    enrollments: number;
  };
};

type Department = {
  id: string;
  name: string;
  code: string;
  courses: Course[];
};

type Organization = {
  id: string;
  name: string;
  code: string;
  departments: Department[];
};

export function CourseForums() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  // Fetch organizations and user profile
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        // Fetch organizations
        const orgsRes = await fetch('/api/organizations');
        const orgsData = await orgsRes.json();
        setOrganizations(orgsData);

        // Fetch user profile with org, dept, and courses
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        setUserProfile(profileData);

        if (profileData?.organizationId) {
          setSelectedOrg(profileData.organizationId);
          setSelectedDept(profileData.departmentId);
        }
      }
    };
    fetchData();
  }, [session]);

  const selectedOrgData = organizations.find(org => org.id === selectedOrg);
  const selectedDeptData = selectedOrgData?.departments.find(dept => dept.id === selectedDept);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleConfirmSelection = async () => {
    try {
      const res = await fetch('/api/profile/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrg,
          departmentId: selectedDept,
          courseIds: selectedCourses,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update courses');
      }

      setIsEditing(false);
      // Refresh user profile
      const profileRes = await fetch('/api/profile');
      const profileData = await profileRes.json();
      setUserProfile(profileData);

      toast.success("Your course selection has been updated.", {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating courses:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update courses", {
        duration: 5000,
      });
    }
  };

  if (!session) {
    return (
      <div className="text-center py-10">
        Please sign in to access course forums
      </div>
    );
  }

  if (!isEditing && userProfile?.courses?.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{userProfile.organization?.name}</h2>
            <p className="text-muted-foreground">{userProfile.department?.name}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Courses</Button>
        </div>

        <div className="flex flex-col space-y-4">
          {userProfile.courses.map((course: Course) => (
            <Link 
              key={course.id} 
              href={`/forums/courses/${course.id}`}
              className="block"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {course.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.level}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {course._count.enrollments} members
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">WhatsApp Group</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join WhatsApp Group</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="mb-4">Click the link below to join the WhatsApp group for {course.name}:</p>
                          <a
                            href={course.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {course.whatsappLink}
                          </a>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Discord Server</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join Discord Server</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="mb-4">Click the link below to join the Discord server for {course.name}:</p>
                          <a
                            href={course.discordLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {course.discordLink}
                          </a>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Organization</label>
          <Select
            value={selectedOrg}
            onValueChange={setSelectedOrg}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOrg && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Department</label>
            <Select
              value={selectedDept}
              onValueChange={setSelectedDept}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a department" />
              </SelectTrigger>
              <SelectContent>
                {selectedOrgData?.departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {selectedDept && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Select Courses ({selectedCourses.length} selected)
            </h3>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedCourses([])}
              >
                Clear
              </Button>
              <Button onClick={handleConfirmSelection}>
                Confirm Selection
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {['FOUNDATION', 'DIPLOMA', 'DEGREE'].map(level => (
              <div key={level} className="space-y-2">
                <h4 className="font-medium">{level} Level</h4>
                <div className="grid gap-2">
                  {selectedDeptData?.courses
                    .filter(course => course.level === level)
                    .map(course => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={course.id}
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => handleCourseToggle(course.id)}
                        />
                        <label
                          htmlFor={course.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {course.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
