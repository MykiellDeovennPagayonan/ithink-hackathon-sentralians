/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProblemDescriptionRenderer from "../problem-description-renderer";

interface Problem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  classroom: Classroom;
  isPublic: boolean;
  createdAt: Date;
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
                {problem.classroom.name}
              </Badge>
              <Badge
                variant={problem.isPublic ? "default" : "outline"}
                className="text-xs sm:text-sm"
              >
                {problem.isPublic ? "Public" : "Private"}
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
          <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
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

        <div className="text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
          <p>
            Classroom:{" "}
            <span className="font-medium">{problem.classroom.name}</span>
          </p>
          <p className="mt-1">{problem.classroom.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
