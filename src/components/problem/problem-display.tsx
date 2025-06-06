/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProblemDescriptionRenderer from "../problem-description-renderer";
import { Problem } from "@/declarations/backend/backend.did";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";

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
            <p className="text-gray-600 text-xs sm:text-sm">
              Created on {formatDate(convertBigIntToDate(problem.createdAt))}
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
                  src={problem.imageUrl?.[0] || "/placeholder.svg"}
                  alt={`Problem: ${problem.title}`}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
