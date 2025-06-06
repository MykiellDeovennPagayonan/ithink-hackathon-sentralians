"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, BookOpen, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/loading-spinner";
import MembersSheet from "./members-sheet";
import MembersCard from "./members-card";
import ProblemList from "./problem-list";
import {
  getClassroomById,
  getClassroomMembersWithUserInfo,
  getProblemsByClassroom,
  isUserClassroomAdmin,
} from "@/services/classroom-service";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserWithClassroom,
  Classroom,
  Problem,
} from "@/declarations/backend/backend.did";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";

export default function ClassroomDetail({ code }: { code: string }) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [members, setMembers] = useState<UserWithClassroom[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const classroomData = await getClassroomById(code);
        setClassroom(classroomData);

        if (classroomData) {
          const [membersData, problemsData] = await Promise.all([
            getClassroomMembersWithUserInfo(code),
            getProblemsByClassroom(code),
          ]);

          setMembers(membersData);
          setProblems(problemsData);

          if (user) {
            const adminStatus = await isUserClassroomAdmin(user.id, code);
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!classroom) {
    return <ClassroomNotFound code={code} />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Link href="/classroom">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classrooms
            </Button>
          </Link>
        </div>

        {/* Classroom Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
            {classroom.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed break-words">
            {classroom.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {members.length} members
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Created
              {formatRelativeDate(convertBigIntToDate(classroom.createdAt))}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {problems.length} problems
            </div>
            <Badge variant="outline" className="text-xs flex items-center">
              Code: {code}
            </Badge>
          </div>
        </div>

        {/* Mobile Members Button */}
        <div className="lg:hidden mb-4">
          <MembersSheet
            members={members}
            classroom={classroom}
            isAdmin={isAdmin}
          />
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Problems List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Classroom Problems
              </h2>
              {isAdmin && (
                <Button className="w-full sm:w-auto" asChild>
                  <Link href={`/classroom/${code}/problem/new`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Problem
                  </Link>
                </Button>
              )}
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <ProblemList problems={problems} isAdmin={isAdmin} />
            </Suspense>
          </div>

          {/* Right Column - Classroom Members (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <MembersCard
              members={members}
              classroom={classroom}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassroomNotFound({ code }: { code: string }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Link href="/classroom">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classrooms
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Classroom Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The classroom with code &quot;{code}&quot; could not be found.
          </p>
          <Link href="/classroom">
            <Button>Browse Classrooms</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
