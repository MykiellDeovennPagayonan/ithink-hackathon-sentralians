"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, BookOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPublicProblems } from "@/services/problem-service";
import type { Problem } from "@/declarations/backend/backend.did";
import LoadingSpinner from "@/components/loading-spinner";
import ProblemList from "@/components/problem-list";

export default function ExplorePage() {
  const [classroomCode, setClassroomCode] = useState("");
  const [problemCode, setProblemCode] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const publicProblems = await getPublicProblems();
        console.log("Fetched public problems:", publicProblems);
        setProblems(Array.isArray(publicProblems) ? publicProblems : []);
      } catch (error) {
        console.error("Error fetching public problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleClassroomJoin = () => {
    if (classroomCode.trim()) {
      router.push(`/classroom/join?code=${classroomCode}`);
    }
  };

  const handleProblemJoin = () => {
    if (problemCode.trim()) {
      router.push(`/problem?id=${problemCode}`);
    }
  };

  // Filter only public problems (no search filtering)
  const publicProblems = problems.filter((problem) => problem.isPublic);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Code Entry Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Enter Code for Classroom
              </CardTitle>
              <CardDescription className="text-sm">
                Join a classroom with your access code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter classroom code..."
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="text-center text-base sm:text-lg h-12"
                onKeyDown={(e) => e.key === "Enter" && handleClassroomJoin()}
              />
              <Button
                onClick={handleClassroomJoin}
                className="w-full h-12"
                disabled={!classroomCode.trim()}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Classroom
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Enter Code for Problem
              </CardTitle>
              <CardDescription className="text-sm">
                Access a specific problem with your code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter problem code..."
                value={problemCode}
                onChange={(e) => setProblemCode(e.target.value)}
                className="text-center text-base sm:text-lg h-12"
                onKeyDown={(e) => e.key === "Enter" && handleProblemJoin()}
              />
              <Button
                onClick={handleProblemJoin}
                className="w-full h-12"
                disabled={!problemCode.trim()}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Access Problem
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Removed search input */}

        {/* Problems List Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Publicly Available Problems
          </h2>
          <span className="text-sm text-gray-500">
            {publicProblems.length} problem
            {publicProblems.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : publicProblems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No public problems found
              </h3>
              <p className="text-gray-500 mb-4">
                No public problems are available yet.
              </p>
              <Button onClick={() => router.push("/problem/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create the First Public Problem
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ProblemList problems={publicProblems} isAdmin={false} />
        )}
      </div>
    </div>
  );
}