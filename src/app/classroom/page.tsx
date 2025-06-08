"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Users, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ClassroomList from "@/components/classroom-list";
import ClassroomSearch from "@/components/classroom-search";
import { getClassroomsByOwner } from "@/services/classroom-service";
import { useGetCurrentUser } from "@/services/auth-service";
import LoadingSpinner from "@/components/loading-spinner";
import ClassroomDetail from "@/components/classroom-detail";
import ClassroomActions from "@/components/classroom-actions";
import type { Classroom } from "@/declarations/backend/backend.did";

export default function ClassroomPageClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const searchTerm = searchParams.get("search") || "";

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useGetCurrentUser();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        if (user) {
          const fetchedClassrooms = await getClassroomsByOwner(user.id);
          setClassrooms(fetchedClassrooms);
        }
      } catch (err) {
        console.error("Failed to fetch classrooms:", err);
        setError("Failed to load classrooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchClassrooms();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  if (code) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ClassroomDetail code={code} />
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

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Oops!</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button onClick={() => location.reload()}>Try Again</Button>
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
              My Classrooms
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your classes and assignments
            </p>
          </div>
          <ClassroomActions userId={user.id} />
        </div>

        {/* Search */}
        <ClassroomSearch initialSearchTerm={searchTerm} />

        {/* Classrooms Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          <ClassroomList
            classrooms={classrooms}
            searchTerm={searchTerm}
            userId={user.id}
          />
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
              <Link href="/register">
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
