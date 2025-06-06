"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProblemDisplay from "@/components/problem/problem-display";
import SolutionSubmission from "@/components/solution-submission";
import { getProblemById } from "@/services/problem-service";
import { getClassroomById } from "@/services/classroom-service";
import { useGetCurrentUser } from "@/services/auth-service";
import LoadingSpinner from "@/components/loading-spinner";
import type { Problem, Classroom } from "@/declarations/backend/backend.did";
import { getClassroomId, hasClassroom } from "@/utils/problem-helpers";
import { validateSolution } from "@/utils/validateSolution";

interface ProblemWithClassroomData extends Problem {
  classroom?: Classroom;
}

const adaptProblemForDisplay = (problem: Problem) => {
  const imageUrlInitial = problem.imageUrl.length > 0 ? problem.imageUrl[0] : undefined
  return (
    {
      title: problem.title,
      description: problem.description,
      createdAt: problem.createdAt,
      imageUrl: imageUrlInitial
    }
  )
}
export default function ProblemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useGetCurrentUser();

  const [problem, setProblem] = useState<ProblemWithClassroomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        setError("No problem ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching problem with ID:", id);

        // Fetch the problem
        const problemData = await getProblemById(id);

        if (!problemData) {
          setError("Problem not found");
          setLoading(false);
          return;
        }

        console.log("Problem data received:", problemData);

        // Check if problem has a classroom and fetch classroom data
        let classroomData: Classroom | null = null;
        if (hasClassroom(problemData)) {
          const classroomId = getClassroomId(problemData);
          if (classroomId) {
            try {
              console.log("Fetching classroom data for ID:", classroomId);
              classroomData = await getClassroomById(classroomId);
              console.log("Classroom data received:", classroomData);
            } catch (classroomError) {
              console.warn("Could not fetch classroom data:", classroomError);
            }
          }
        }

        const problemWithClassroom: ProblemWithClassroomData = {
          ...problemData,
          ...(classroomData && { classroom: classroomData }),
        };

        setProblem(problemWithClassroom);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSolutionSubmit = async (imageUrl: string) => {
    if (!problem || !user) {
      console.error("Cannot submit solution: missing problem or user data");
      return;
    }

    try {
      console.log("Submitting solution for problem:", problem.id);
      console.log("Image data length:", imageUrl.length);

      const validation = await validateSolution(problem.description, imageUrl);
      console.log(validation);
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert("Failed to submit solution. Please try again.");
    }
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

  // Show loading state
  if (loading || !isMounted) {
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
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-gray-500 mt-4">Loading problem...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if problem not found or error occurred
  if (error || !problem) {
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
              {error || `The problem with ID "${id}" could not be found.`}
            </p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
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
            <ProblemDisplay problem={adaptProblemForDisplay(problem)} />
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
