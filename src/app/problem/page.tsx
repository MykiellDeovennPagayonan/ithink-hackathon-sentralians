"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProblemDisplay from "@/components/problem/problem-display";
import SolutionSubmission from "@/components/solution-submission";
import { mockProblems } from "@/mockdata/problems";
import { mockClassrooms } from "@/mockdata/classrooms";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isMounted, setIsMounted] = useState(false);

  const rawProblem = mockProblems.find((p) => p.id === id);
  
  // Handle cases where a problem might not have a classroom
  const classroom = rawProblem?.classroomId 
    ? (() => {
        const c = mockClassrooms.find((c) => c.id === rawProblem.classroomId);
        const classroomCreatedAt =
          c && c.createdAt ? new Date(c.createdAt) : new Date();
        // If invalid, fallback to now
        return c
          ? {
              ...c,
              createdAt: isNaN(classroomCreatedAt.getTime())
                ? new Date()
                : classroomCreatedAt,
            }
          : null;
      })()
    : null;  // No classroom ID means no classroom needed

  const problem = rawProblem
    ? {
        ...rawProblem,
        // Include classroom only if it exists
        ...(classroom && { classroom }),
        imageUrl: rawProblem.imageUrl ?? undefined,
        createdAt: rawProblem.createdAt
          ? isNaN(new Date(rawProblem.createdAt).getTime())
            ? new Date()
            : new Date(rawProblem.createdAt)
          : new Date(),
      }
    : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSolutionSubmit = async (imageData: string) => {
    console.log("Submitting solution for problem:", imageData);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would send the image to AI for analysis
    alert(
      "Solution submitted! The AI will analyze your work and provide feedback."
    );
  };

  // Show error state if no ID provided
  if (!id) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              No problem ID was provided in the URL.
            </p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if problem not found
  if (!problem) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            <Link href="/explore">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The problem with ID &quot;{id}&quot; could not be found.
            </p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the equation content until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            <Link href="/explore">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-160px)]">
            <div className="flex flex-col">
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading problem...</div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col">
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-gray-500">
                    Loading submission area...
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Link href="/explore">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-160px)]">
          {/* Left Side - Problem Display */}
          <div className="flex flex-col order-1 lg:order-1">
            <ProblemDisplay problem={problem} />
          </div>

          {/* Right Side - Submission Area */}
          <div className="flex flex-col order-2 lg:order-2">
            <SolutionSubmission onSubmit={handleSolutionSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
