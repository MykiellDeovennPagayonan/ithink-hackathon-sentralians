import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar } from "lucide-react";
import { formatRelativeDate } from "@/lib/formatRelativeDate";
import { TempProblem } from "@/services/problem-service";

interface ProblemListProps {
  problems: TempProblem[];
  isAdmin: boolean;
}

export default function ProblemList({ problems, isAdmin }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No problems yet</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            This classroom doesn&apos;t have any problems yet.
            {isAdmin && " Add some problems to get started."}
          </p>
          {isAdmin && (
            <Button asChild>
              <Link href={`/classroom/${problems[0]?.classroomId}/problem/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Problem
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {problems.map((problem) => (
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
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/problem?id=${problem.id}`}>Solve</Link>
                  </Button>
                </div>
              </div>

              {/* Problem Stats */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created {formatRelativeDate(problem.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
