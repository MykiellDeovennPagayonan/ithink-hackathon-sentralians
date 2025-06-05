/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProblemDescriptionRenderer from "../problem-description-renderer";

interface Problem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  classroom?: Classroom;
  isPublic: boolean;
  createdAt: Date;
  category: string;
  difficulty: string;
}

interface Classroom {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
}

interface ProblemDisplayProps {
  problem: Problem;
  className?: string;
}

export default function ProblemDisplay({
  problem,
  className = "",
}: ProblemDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={`flex-1 ${className}`}>
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
                className={`text-xs sm:text-sm border ${getDifficultyColor(problem.difficulty)}`}
                variant="outline"
              >
                {problem.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Created on {formatDate(problem.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
        <div>
          <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Problem Description:
          </h3>
          <div className="text-gray-700 leading-relaxed text-sm sm:text-base bg-gray-50 rounded-lg p-4">
            <ProblemDescriptionRenderer content={problem.description} />
          </div>
        </div>

        {problem.imageUrl && (
          <div className="flex-1 flex flex-col">
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Problem Image:
            </h3>
            <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col justify-center overflow-hidden">
              <div className="w-full max-w-full flex justify-center">
                <img
                  src={problem.imageUrl || "/placeholder.svg"}
                  alt={`Problem: ${problem.title}`}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {problem.classroom && (
          <div className="text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
            <p>
              Classroom:{" "}
              <span className="font-medium">{problem.classroom.name}</span>
            </p>
            <p className="mt-1">{problem.classroom.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
