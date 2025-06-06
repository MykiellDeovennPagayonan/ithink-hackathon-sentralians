"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProblemDisplay from "@/components/problem/problem-display";
import { mockProblems } from "@/mockdata/problems";
import { mockClassrooms } from "@/mockdata/classrooms";
import { validateSolution } from "@/utils/validateSolution";
import SubmissionArea from "@/components/SubmissionArea";
import { Problem } from "@/declarations/backend/backend.did";
import ValidationDisplay, { ValidationResult } from "@/components/ValidationDisplay";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Ref to the validation component container
  const validationRef = useRef<HTMLDivElement>(null);

  const rawProblem = mockProblems.find((p) => p.id === id);

  // Handle cases where a problem might not have a classroom
  const classroom = rawProblem?.classroomId
    ? (() => {
      const c = mockClassrooms.find((c) => c.id === rawProblem.classroomId);
      const classroomCreatedAt = c && c.createdAt ? new Date(c.createdAt) : new Date();
      return c
        ? {
          ...c,
          createdAt: isNaN(classroomCreatedAt.getTime()) ? new Date() : classroomCreatedAt,
        }
        : null;
    })()
    : null;

  const problem = rawProblem
    ? {
      ...rawProblem,
      ...(classroom && { classroom }),
      classroomId: rawProblem.classroomId ? ([rawProblem.classroomId] as [string]) : ([] as []),
      imageUrl: rawProblem.imageUrl ? ([rawProblem.imageUrl] as [string]) : ([] as []),
      creatorId: "default-creator-id",
      createdAt: rawProblem.createdAt
        ? isNaN(new Date(rawProblem.createdAt).getTime())
          ? BigInt(new Date().getTime())
          : BigInt(new Date(rawProblem.createdAt).getTime())
        : BigInt(new Date().getTime()),
    }
    : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // When validationResult is set, scroll to its container
  useEffect(() => {
    if (validationResult && validationRef.current) {
      validationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [validationResult]);

  const handleUploadStart = () => { };

  const handleUploadComplete = (imageUrl: string) => {
    console.log("Upload completed:", imageUrl);
  };

  const handleUploadError = () => {
    console.error("Upload failed");
  };

  const handleSubmit = async (imageUrl: string) => {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Problem Not Found</h1>
            <p className="text-gray-600 mb-6">No problem ID was provided in the URL.</p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  <div className="text-gray-500">Loading submission area...</div>
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
            <ProblemDisplay problem={adaptProblemForDisplay(problem)} />
          </div>

          {/* Right Side - Submission Area */}
          <SubmissionArea
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
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
