"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users } from "lucide-react";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import CreateClassroomDialog from "./create-classroom-dialog";
import JoinClassroomDialog from "./join-classroom-dialog";
import { Classroom } from "@/declarations/backend/backend.did";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";

interface ClassroomListProps {
  classrooms: Classroom[];
  searchTerm: string;
  userId: string;
}

export default function ClassroomList({
  classrooms,
  searchTerm,
  userId,
}: ClassroomListProps) {
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    const filtered = classrooms.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClassrooms(filtered);
  }, [classrooms, searchTerm]);

  if (filteredClassrooms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Users className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No classrooms found
        </h3>
        <p className="text-gray-600 mb-6">
          {searchTerm
            ? `No classrooms match your search for "${searchTerm}"`
            : "Join your first classroom to get started with collaborative learning."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <JoinClassroomDialog buttonVariant="outline" userId={userId} />
          <CreateClassroomDialog userId={userId} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredClassrooms.map((classroom) => (
        <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl mb-2">
                  {classroom.name}
                </CardTitle>
                <CardDescription>{classroom.description}</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              Created{" "}
              {formatRelativeDate(convertBigIntToDate(classroom.createdAt))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/classroom?code=${classroom.id}`}>
                Enter Classroom
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
