"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Users,
  LogIn,
  UserPlus,
  BookOpen,
  Plus,
  Calendar,
  Search,
  Clock,
  TrendingUp,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockClassrooms, mockClassroomMembers } from "@/mockdata/classrooms";
import { mockProblems } from "@/mockdata/problems";

// Mock user state - in a real app, this would come from your auth provider
const mockUser = {
  isLoggedIn: true,
  name: "John Doe",
  email: "john@example.com",
};

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function ClassroomPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [newClassroomName, setNewClassroomName] = useState("");
  const [newClassroomDescription, setNewClassroomDescription] = useState("");
  const [joinClassroomCode, setJoinClassroomCode] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  // If a specific classroom code is provided, show that classroom
  if (code) {
    const classroom = mockClassrooms.find((c) => c.id === code);

    if (!classroom) {
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
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Classroom Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The classroom with code &quot;{code}&quot; could not be found.
              </p>
              <Link href="/classroom">
                <Button>Browse Classrooms</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const members = mockClassroomMembers[code] || [];
    const classroomProblems = mockProblems.filter((problem) =>
      classroom.problems.some((cp) => cp.id === problem.id)
    );
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
        {teachers.length > 0 && (
          <>
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
                    <p className="text-xs text-gray-500 truncate">
                      {teacher.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
          </>
        )}

        {students.length > 0 && (
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
        )}
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
                                  <Link href={`/problem?id=${problem.id}`}>
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
                                <span>
                                  {problem.completionRate}% completion
                                </span>
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
                    <h3 className="text-lg font-medium mb-2">
                      No problems yet
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      This classroom doesn&apos;t have any problems yet. Add
                      some problems to get started.
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
              <Card className="h-fit sticky top-20">
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

  const filteredClassrooms = mockClassrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClassroom = () => {
    // In a real app, this would create a new classroom in the database
    alert(`Classroom "${newClassroomName}" created successfully!`);
    setNewClassroomName("");
    setNewClassroomDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleJoinClassroom = () => {
    // In a real app, this would join an existing classroom
    if (joinClassroomCode.trim()) {
      router.push(`/classroom?code=${joinClassroomCode}`);
    }
  };

  if (!mockUser.isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Access Your Classrooms
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              You need to be logged in to view and manage your classrooms. Join
              classes, track assignments, and collaborate with your peers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>New to AI Teach?</strong> Create an account to join
                classrooms, access assignments, and get personalized AI feedback
                on your solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user view - classroom list
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Classrooms
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your classes and assignments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Join Classroom
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Classroom</DialogTitle>
                  <DialogDescription>
                    Enter the classroom code provided by your teacher to join.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Classroom Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter classroom code..."
                      value={joinClassroomCode}
                      onChange={(e) => setJoinClassroomCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsJoinDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleJoinClassroom}
                    disabled={!joinClassroomCode.trim()}
                  >
                    Join Classroom
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Classroom
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Classroom</DialogTitle>
                  <DialogDescription>
                    Create a new classroom to share problems and collaborate
                    with students.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Classroom Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter classroom name..."
                      value={newClassroomName}
                      onChange={(e) => setNewClassroomName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this classroom is about..."
                      value={newClassroomDescription}
                      onChange={(e) =>
                        setNewClassroomDescription(e.target.value)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateClassroom}
                    disabled={!newClassroomName.trim()}
                  >
                    Create Classroom
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search classrooms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Classrooms Grid */}
        {filteredClassrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl mb-2">
                        {classroom.name}
                      </CardTitle>
                      <CardDescription>{classroom.description}</CardDescription>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Students</p>
                      <p className="font-medium">{classroom.students}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Problems</p>
                      <p className="font-medium">{classroom.problems.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created {classroom.created}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/classroom?code=${classroom.id}`}>
                      Enter Classroom
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classrooms found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No classrooms match your search for "${searchTerm}"`
                : "Join your first classroom to get started with collaborative learning."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setIsJoinDialogOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Join Classroom
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Classroom
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
