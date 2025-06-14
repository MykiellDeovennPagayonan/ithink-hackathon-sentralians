"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ImageIcon, Search } from "lucide-react";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import type { Problem } from "@/declarations/backend/backend.did";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";
import { hasClassroom, getImageUrl, hasImage } from "@/utils/problem-helpers";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

interface ProblemListProps {
  problems: Problem[];
  isAdmin: boolean;
}

function formatProblemDate(createdAt: bigint | string | number): string {
  try {
    console.log("Formatting date for:", { createdAt, type: typeof createdAt });

    const date = convertBigIntToDate(createdAt);
    console.log("Converted to date:", date, "Valid:", !isNaN(date.getTime()));

    if (isNaN(date.getTime())) {
      console.error("Invalid date after conversion");
      return "recently";
    }

    const formatted = formatRelativeDate(date);
    console.log("Formatted as:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error formatting problem date:", error, { createdAt });
    return "recently";
  }
}

function sortProblemsByDate(problems: Problem[]): Problem[] {
  return [...problems].sort((a, b) => {
    const dateA = Number(a.createdAt);
    const dateB = Number(b.createdAt);
    return dateB - dateA;
  });
}

export default function ProblemList({ problems, isAdmin }: ProblemListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(
    sortProblemsByDate(problems)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const sortedProblems = sortProblemsByDate(problems);

    if (!searchTerm) {
      setFilteredProblems(sortedProblems);
    } else {
      const filtered = sortedProblems.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProblems(filtered);
    }

    setSearchInput(searchTerm);
  }, [problems, searchTerm]);

  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No problems yet</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            {isAdmin
              ? "You haven't created any problems yet. Create your first problem to get started."
              : "This classroom doesn't have any problems yet."}
            {isAdmin && " Add some problems to get started."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search problems by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {filteredProblems.length === 0 && searchTerm ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No problems found</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              No problems match your search for &quot;{searchTerm}&quot;. Try
              adjusting your search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((problem) => {
            const imageUrl = getImageUrl(problem);

            return (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Problem Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                            {problem.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={problem.isPublic ? "default" : "outline"}
                              className="text-xs"
                            >
                              {problem.isPublic ? "Public" : "Private"}
                            </Badge>
                            {hasClassroom(problem) && (
                              <Badge variant="secondary" className="text-xs">
                                Classroom
                              </Badge>
                            )}
                            {hasImage(problem) && (
                              <Badge variant="outline" className="text-xs">
                                <ImageIcon className="w-3 h-3 mr-1" />
                                Image
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <Button asChild className="w-full sm:w-auto">
                          <Link href={`/problem?id=${problem.id}`}>
                            {isAdmin ? "View" : "Solve"}
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Problem Stats */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Created {formatProblemDate(problem.createdAt)}
                        </span>
                      </div>
                      {imageUrl && (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
