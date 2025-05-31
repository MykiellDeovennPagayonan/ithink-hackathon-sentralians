"use client";

import { useState } from "react";
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
  Users,
  LogIn,
  UserPlus,
  BookOpen,
  Plus,
  Calendar,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockClassrooms } from "@/mockdata/classrooms";

// Mock user state - in a real app, this would come from your auth provider
const mockUser = {
  isLoggedIn: true, // Change to true to see logged-in state
  name: "John Doe",
  email: "john@example.com",
};

export default function ClassroomPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newClassroomName, setNewClassroomName] = useState("");
  const [newClassroomDescription, setNewClassroomDescription] = useState("");
  const [joinClassroomCode, setJoinClassroomCode] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const router = useRouter();

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
      router.push(`/classroom/${joinClassroomCode}`);
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

  // Logged-in user view
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
                    <Link href={`/classroom/${classroom.id}`}>
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
