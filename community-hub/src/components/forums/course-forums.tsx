"use client"
import { useState } from "react";
import { organizations } from "@/data/course-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CourseForums() {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");

  const selectedOrgData = organizations.find((org) => org.id === selectedOrg);
  const selectedDeptData = selectedOrgData?.departments.find(
    (dept) => dept.id === selectedDept
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Forums</CardTitle>
          <CardDescription>
            Select your organization and department to view subject-specific forums
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization</label>
              <Select
                value={selectedOrg}
                onValueChange={(value) => {
                  setSelectedOrg(value);
                  setSelectedDept("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDept}
                onValueChange={setSelectedDept}
                disabled={!selectedOrg}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {selectedOrgData?.departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDeptData && (
        <div className="space-y-6">
          {selectedDeptData.levels ? (
            // Display subjects organized by levels
            selectedDeptData.levels.map((level) => (
              <Card key={level.id}>
                <CardHeader>
                  <CardTitle>{level.name}</CardTitle>
                  <CardDescription>
                    {level.subjects.length} subjects in this level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {level.subjects.map((subject) => (
                      <Link
                        key={subject.id}
                        href={`/forums/courses/${selectedOrg}/${selectedDept}/${level.id}/${subject.id}`}
                        className="block"
                      >
                        <div className="p-4 rounded-lg border hover:border-primary transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{subject.name}</h3>
                              {subject.code && (
                                <p className="text-sm text-muted-foreground">
                                  {subject.code}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary">Forum</Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Display subjects without levels
            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDeptData.subjects?.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/forums/courses/${selectedOrg}/${selectedDept}/${subject.id}`}
                      className="block"
                    >
                      <div className="p-4 rounded-lg border hover:border-primary transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{subject.name}</h3>
                            {subject.code && (
                              <p className="text-sm text-muted-foreground">
                                {subject.code}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary">Forum</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
