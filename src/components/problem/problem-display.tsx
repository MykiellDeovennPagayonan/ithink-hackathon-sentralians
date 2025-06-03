import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MathRenderer from "../math-renderer";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdBy: string;
  latexEquation: string;
  instructions?: string;
}

interface ProblemDisplayProps {
  problem: Problem;
  className?: string;
}

export default function ProblemDisplay({
  problem,
  className = "",
}: ProblemDisplayProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                className={`text-xs sm:text-sm ${getDifficultyColor(problem.difficulty)}`}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Created by {problem.createdBy}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
        <div>
          <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Problem Description:
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {problem.description}
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            Problem:
          </h3>
          <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col justify-center overflow-hidden">
            <div className="w-full max-w-full">
              <MathRenderer latex={problem.latexEquation} className="mb-4" />

              {/* Instructions Section */}
              {problem.instructions && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-blue-700 font-medium text-sm sm:text-base text-center">
                    {problem.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
