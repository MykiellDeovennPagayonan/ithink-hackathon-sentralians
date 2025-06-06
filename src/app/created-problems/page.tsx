"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Code, LogIn, UserPlus, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProblemList from "@/components/problem-list";
import ProblemSearch from "@/components/problem-search";
import { getProblemsByUserId } from "@/services/problem-service";
import { useGetCurrentUser } from "@/services/auth-service";
import LoadingSpinner from "@/components/loading-spinner";
import ProblemDetail from "@/components/problem-detail";
import type { Problem } from "@/declarations/backend/backend.did";

export default function CreatedProblemsPageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const searchTerm = searchParams.get("search") || "";
  const [loading, setLoading] = useState(true);

  const [problems, setProblems] = useState<Problem[]>([]);
  const { user, loading: authLoading } = useGetCurrentUser();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (user) {
          const fetchedProblems = await getProblemsByUserId(user.id);
          console.log("Fetched problems:", fetchedProblems);

          let problemsArray: Problem[] = [];

          if (Array.isArray(fetchedProblems)) {
            problemsArray = fetchedProblems;
          } else if (fetchedProblems && typeof fetchedProblems === "object") {
            problemsArray = [fetchedProblems as Problem];
          }

          console.log("Processed problems array:", problemsArray);
          setProblems(problemsArray);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    // Only proceed when auth loading is complete
    if (!authLoading) {
      if (user) {
        fetchProblems();
      } else {
        // If no user and auth is done loading, set loading to false
        setLoading(false);
      }
    }
  }, [user, authLoading]); // Add authLoading as a dependency

  if (id) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ProblemDetail id={id} />
      </Suspense>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <NotLoggedInView />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Created Problems
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track the coding problems you&apos;ve created
            </p>
          </div>
          <Button asChild>
            <Link href="/problem/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Problem
            </Link>
          </Button>
        </div>

        {/* Search */}
        <ProblemSearch initialSearchTerm={searchTerm} />

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Debug: Found {problems.length} problem(s)
            </p>
          </div>
        )}

        {/* Problems List */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProblemList problems={problems} isAdmin={true} />
        </Suspense>
      </div>
    </div>
  );
}

function NotLoggedInView() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Code className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Access Your Created Problems
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            You need to be logged in to view and manage the coding problems
            you&apos;ve created. Create, edit, and track the performance of your
            problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="/motoko-login">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/motoko-register">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>New to AI Teach?</strong> Create an account to start
              creating and managing coding problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
