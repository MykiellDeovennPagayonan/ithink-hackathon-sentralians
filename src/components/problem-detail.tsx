/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loading-spinner";
import type { Problem } from "@/declarations/backend/backend.did";
import { getProblemById } from "@/services/problem-service";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";
import {
  getImageUrl,
  getClassroomId,
  hasImage,
  hasClassroom,
} from "@/utils/problem-helpers";

interface ProblemDetailProps {
  id: string;
}

export default function ProblemDetail({ id }: ProblemDetailProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problemData = await getProblemById(id);
        setProblem(problemData);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Problem Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The problem you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/created-problems">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(problem);
  const classroomId = getClassroomId(problem);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {problem.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/problem/edit?id=${problem.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="outline">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Problem Description</CardTitle>
                  <Badge variant={problem.isPublic ? "default" : "outline"}>
                    {problem.isPublic ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" /> Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem Image */}
            {hasImage(problem) && imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Problem Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 w-full">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={problem.title}
                      className="object-contain rounded-md w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Problem Info */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Created</span>
                    <p className="font-medium">
                      {formatRelativeDate(
                        convertBigIntToDate(problem.createdAt)
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Problem ID</span>
                    <p className="font-medium text-xs break-all">
                      {problem.id}
                    </p>
                  </div>
                  {hasClassroom(problem) && classroomId && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Classroom ID
                      </span>
                      <p className="font-medium text-xs break-all">
                        {classroomId}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Visibility</span>
                    <p className="font-medium flex items-center gap-1">
                      {problem.isPublic ? (
                        <>
                          <Globe className="h-4 w-4" /> Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" /> Private
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/problem?id=${problem.id}`}>
                    View as Student
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Share Problem
                </Button>
                {hasClassroom(problem) && classroomId && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/classroom?code=${classroomId}`}>
                      View Classroom
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
