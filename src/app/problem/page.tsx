"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProblemDisplay from "@/components/problem/problem-display";
import { validateSolution } from "@/utils/validateSolution";
import { Classroom, Problem } from "@/declarations/backend/backend.did";
import ValidationDisplay, { ValidationResult } from "@/components/ValidationDisplay";
import { useGetCurrentUser } from "@/services/auth-service";
import { getProblemById } from "@/services/problem-service";
import { getClassroomId, hasClassroom } from "@/utils/problem-helpers";
import { getClassroomById } from "@/services/classroom-service";
import LoadingSpinner from "@/components/loading-spinner";
import SolutionSubmission from "@/components/solution-submission";

interface ProblemWithClassroomData extends Problem {
  classroom?: Classroom;
}

const adaptProblemForDisplay = (problem: Problem) => {
  const imageUrlInitial = problem.imageUrl.length > 0 ? problem.imageUrl[0] : undefined;
  return {
    title: problem.title,
    description: problem.description,
    createdAt: problem.createdAt,
    imageUrl: imageUrlInitial,
  };
};

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useGetCurrentUser();
  const [problem, setProblem] = useState<ProblemWithClassroomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const validationRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

        const problemData = await getProblemById(id);

        if (!problemData) {
          setError("Problem not found");
          setLoading(false);
          return;
        }

        console.log("Problem data received:", problemData);

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

  useEffect(() => {
    if (validationResult && validationRef.current) {
      validationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [validationResult]);

  const handleUploadComplete = (imageUrl: string) => {
    console.log("Upload completed:", imageUrl);
  };

  const handleSubmit = async (imageUrl: string) => {
    if (!problem || !user) {
      console.error("Cannot submit solution: missing problem or user data");
      return;
    }
    setIsSubmitting(true);
    console.log(imageUrl);
    try {
      const question = problem?.description
      if (question) {
        const validation = await validateSolution(question, imageUrl);
        console.log(validation);
        setValidationResult(validation as unknown as ValidationResult);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit solution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <SolutionSubmission
            onUploadComplete={handleUploadComplete}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>

        {validationResult && (
          <div ref={validationRef}>
            <ValidationDisplay validation={validationResult} />
          </div>
        )}
      </div>
    </div>
  );
}
