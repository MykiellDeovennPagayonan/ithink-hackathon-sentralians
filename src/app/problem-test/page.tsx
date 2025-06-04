"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockProblems } from "@/mockdata/problems";
import SubmissionArea from "@/components/SubmissionArea"; // Add this import

interface MathJax {
  typesetPromise: (elements?: Element[]) => Promise<void>;
  startup: {
    defaultReady: () => void;
  };
}

declare global {
  interface Window {
    MathJax: MathJax;
  }
}

export default function ProblemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isMounted, setIsMounted] = useState(false);
  const [mathRendered, setMathRendered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const equationRef = useRef<HTMLDivElement>(null);

  const problem = mockProblems.find((p) => p.id === id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !problem) return;

    const renderMath = async () => {
      const checkMathJax = () => {
        return window.MathJax && window.MathJax.typesetPromise;
      };

      if (checkMathJax()) {
        try {
          await window.MathJax.typesetPromise(
            [equationRef.current].filter(Boolean) as Element[]
          );
          setMathRendered(true);
        } catch (err) {
          console.log("MathJax error:", err);
        }
      } else {
        const interval = setInterval(async () => {
          if (checkMathJax()) {
            clearInterval(interval);
            try {
              await window.MathJax.typesetPromise(
                [equationRef.current].filter(Boolean) as Element[]
              );
              setMathRendered(true);
            } catch (err) {
              console.log("MathJax error:", err);
            }
          }
        }, 100);

        return () => clearInterval(interval);
      }
    };

    renderMath();
  }, [isMounted, problem]);

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

  const handleUploadStart = () => {
  };

  const handleUploadComplete = (imageUrl: string) => {
    console.log("Upload completed:", imageUrl);
  };

  const handleUploadError = () => {;
    console.error("Upload failed");
  };

  const handleSubmit = async (imageUrl: string) => {
    setIsSubmitting(true);
    console.log(imageUrl)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      alert(
        "Solution submitted! The AI will analyze your work and provide feedback."
      );
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
          <div className="flex flex-col order-1 lg:order-1">
            <Card className="flex-1">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2 leading-tight">
                      {problem.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {problem.category}
                      </Badge>
                      <Badge
                        className={`text-xs sm:text-sm ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Created by {problem.createdBy}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Problem Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {problem.description}
                  </p>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Problem:
                  </h3>
                  <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col justify-center overflow-hidden">
                    <div className="w-full max-w-full">
                      {!mathRendered && (
                        <div className="text-gray-500 text-xs sm:text-sm mb-2 text-center">
                          Rendering equation...
                        </div>
                      )}
                      <div
                        ref={equationRef}
                        className="w-full overflow-x-auto overflow-y-hidden mb-4"
                        style={{
                          opacity: mathRendered ? 1 : 0,
                          transition: "opacity 0.3s ease-in-out",
                          fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
                          lineHeight: "1.6",
                        }}
                      >
                        <div className="min-w-max px-2 py-1 text-center">{`$$${problem.latexEquation}$$`}</div>
                      </div>

                      {problem.instructions && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p className="text-blue-700 font-medium text-sm sm:text-base text-center">
                            {problem.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <SubmissionArea
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

      </div>
    </div>
  );
}