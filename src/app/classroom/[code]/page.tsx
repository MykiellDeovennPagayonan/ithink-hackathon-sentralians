"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Plus,
  Clock,
  TrendingUp,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { mockProblems } from "@/mockdata/problems";
import { mockClassrooms, mockClassroomMembers } from "@/mockdata/classrooms";

interface ClassroomPageProps {
  params: Promise<{
    code: string;
  }>;
}

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function ClassroomPage({ params }: ClassroomPageProps) {
  // Properly unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const { code } = resolvedParams;

  // In a real app, you would fetch the classroom data based on the code
  const classroom =
    mockClassrooms.find((c) => c.id === code) || mockClassrooms[0];
  const members = mockClassroomMembers[code] || mockClassroomMembers.MATH101;

  // Get the problems that are in this classroom
  const classroomProblems = mockProblems.filter((problem) =>
    classroom.problems.some((cp) => cp.id === problem.id)
  );

  // Separate members by role
  const teachers = members.filter((member) => member.role === "teacher");
  const students = members.filter((member) => member.role === "student");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Members content component for reuse
  const MembersContent = () => (
    <div className="space-y-3">
      {/* Teacher/Owner Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Crown className="h-3.5 w-3.5 text-yellow-500" />
          Teacher
        </h3>
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors"
          >
            <Avatar className="h-10 w-10 border-2 border-blue-200 flex-shrink-0">
              <AvatarImage
                src={teacher.avatar || "/placeholder.svg"}
                alt={teacher.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getInitials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {teacher.name}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 text-xs flex-shrink-0"
                >
                  Owner
                </Badge>
              </div>
              <p className="text-xs text-gray-500 truncate">{teacher.email}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Students Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          Students ({students.length})
        </h3>
        <div className="max-h-64 overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage
                  src={student.avatar || "/placeholder.svg"}
                  alt={student.name}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {student.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Link href="/classroom">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classrooms
            </Button>
          </Link>
        </div>

        {/* Classroom Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
            {classroom.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed break-words">
            {classroom.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {classroom.students} students
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Created {classroom.created}
            </div>
            <Badge variant="outline" className="text-xs flex items-center">
              Code: {code}
            </Badge>
          </div>
        </div>

        {/* Mobile Members Button */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View Members ({members.length})
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Classroom Members
                </SheetTitle>
                <p className="text-sm text-gray-600">
                  {members.length} members
                </p>
              </SheetHeader>
              <div className="mt-6">
                <MembersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Problems List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Classroom Problems
              </h2>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </Button>
            </div>

            {classroomProblems.length > 0 ? (
              <div className="space-y-3">
                {classroomProblems.map((problem) => {
                  const problemInfo = classroom.problems.find(
                    (p) => p.id === problem.id
                  );

                  return (
                    <Card
                      key={problem.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-4">
                          {/* Problem Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                                  {problem.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {problem.category}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${getDifficultyColor(problem.difficulty)}`}
                                  >
                                    {problem.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed break-words">
                                {problem.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0 w-full sm:w-auto">
                              <Button asChild className="w-full sm:w-auto">
                                <Link href={`/problem/${problem.id}`}>
                                  Solve
                                </Link>
                              </Button>
                            </div>
                          </div>

                          {/* Problem Stats */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{problem.participants} attempts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{problem.completionRate}% completion</span>
                            </div>
                            <div className="hidden sm:block">
                              Created by {problemInfo?.createdBy}
                            </div>
                            <div className="hidden sm:block">
                              {problemInfo?.createdAt}
                            </div>
                            {/* Mobile: Show creator and date on separate lines */}
                            <div className="sm:hidden w-full flex flex-col gap-1">
                              <div>Created by {problemInfo?.createdBy}</div>
                              <div>{problemInfo?.createdAt}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No problems yet</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    This classroom doesn&apos;t have any problems yet. Add some
                    problems to get started.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Problem
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Classroom Members (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="h-fit sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Classroom Members</CardTitle>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {members.length} members
                </p>
              </CardHeader>
              <CardContent>
                <MembersContent />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
