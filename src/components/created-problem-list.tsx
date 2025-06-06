import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Edit, Eye, Trash2, Pi } from "lucide-react";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import type { Problem } from "@/declarations/backend/backend.did";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";

interface CreatedProblemListProps {
  problems: Problem[];
  classroomNames?: Map<string, string>;
}

export default function CreatedProblemList({
  problems,
  classroomNames = new Map(),
}: CreatedProblemListProps) {
  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Pi className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No problems created yet</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            You haven&apos;t created any problems yet. Start creating math
            problems to help others learn and practice.
          </p>
          <Button asChild>
            <Link href="/problem/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Problem
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {problems.map((problem) => {
        const classroomName =
          problem.classroomId &&
          problem.classroomId.length > 0 &&
          problem.classroomId[0] !== undefined
            ? classroomNames.get(problem.classroomId[0])
            : null;

        return (
          <Card key={problem.id} className="hover:shadow-md transition-shadow">
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
                        {classroomName && (
                          <Badge variant="secondary" className="text-xs">
                            {classroomName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed break-words line-clamp-3">
                      {problem.description.replace(
                        /\$\$[^$]*\$\$/g,
                        "[Math Expression]"
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 sm:flex-none"
                      >
                        <Link href={`/problem?id=${problem.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 sm:flex-none"
                      >
                        <Link href={`/problem/edit?id=${problem.id}`}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="px-2">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Problem Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Created{" "}
                      {formatRelativeDate(
                        convertBigIntToDate(problem.createdAt)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
