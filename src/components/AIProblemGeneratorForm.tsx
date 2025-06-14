"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateProblems } from "@/utils/generateProblems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProblemDisplay from "@/components/problem/problem-display";
import { createProblem } from "@/services/problem-service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Problem {
  title: string;
  difficulty: string;
  topic: string;
  problem_latex: string;
}

interface GenerateResult {
  function_call: {
    function: {
      name: string;
      arguments: {
        problems: Problem[];
      };
    };
    id: string;
    type: string;
  };
}

const adaptProblemForDisplay = (problem: Problem) => ({
  title: problem.title,
  description: problem.problem_latex,
});

export default function AiProblemGeneratorForm() {
  const [topic, setTopic] = useState("");
  const [referenceQuestion, setReferenceQuestion] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [isPublic, setIsPublic] = useState(true);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const classroomIdFromQuery = searchParams.get("classroomId");
  const { user, loading: authLoading } = useAuth();
  const [creatingIndexes, setCreatingIndexes] = useState<Set<number>>(
    new Set()
  );
  const [createdProblems, setCreatedProblems] = useState<Set<string>>(
    new Set()
  );

  const handleGenerate = async () => {
    if (!topic.trim() && !referenceQuestion.trim()) {
      setError(
        "Please provide either a topic or a reference question (or both)."
      );
      return;
    }

    if (numQuestions < 1 || numQuestions > 5) {
      setError("Number of questions must be between 1 and 5.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateProblems(
        topic || undefined,
        referenceQuestion || undefined,
        numQuestions
      );
      setResult(response as unknown as GenerateResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate problems";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const presetExamples = [
    { topic: "Algebra", question: "Solve for x: 2x + 5 = 13" },
    {
      topic: "Geometry",
      question: "Area of a triangle with base 8 and height 6",
    },
    {
      topic: "Calculus",
      question: "Derivative of f(x) = x² + 3x - 2",
    },
    { topic: "Statistics", question: "" },
    { topic: "", question: "What is 15% of 240?" },
  ];

  const loadPreset = (preset: (typeof presetExamples)[0]) => {
    setTopic(preset.topic);
    setReferenceQuestion(preset.question);
    setError(null);
  };

  const canGenerate = topic.trim() || referenceQuestion.trim();

  const handleUseAiProblem = async (problem: Problem, index: number) => {
    const userId = user?.id;
    if (!userId) {
      setError("You must be logged in to create problems.");
      return;
    }

    const problemKey = `${problem.title}|${problem.problem_latex}`;
    if (createdProblems.has(problemKey)) {
      toast.info("This problem has already been created.");
      return;
    }

    setCreatingIndexes((prev) => new Set(prev).add(index));

    const problemData = {
      title: problem.title,
      description: problem.problem_latex,
      imageUrl: null,
      classroomId: classroomIdFromQuery ?? null,
      isPublic: isPublic,
    };

    try {
      await createProblem(problemData, userId);
      setCreatedProblems((prev) => new Set(prev).add(problemKey));

      toast.success("Problem created successfully!", {
        description: `"${problem.title}" has been added to the classroom.`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create problem");
    } finally {
      setCreatingIndexes((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  return (
    <div className="p-1 md:p-2">
      <h2 className="text-xl font-semibold mb-1 text-foreground">
        AI Problem Generator
      </h2>
      {classroomIdFromQuery && (
        <p className="text-sm text-muted-foreground mb-4">
          ✨ Problems generated here can be associated with Classroom ID:{" "}
          <span className="font-semibold">{classroomIdFromQuery}</span>.
        </p>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Quick Examples:
        </h3>
        <div className="flex flex-wrap gap-2">
          {presetExamples.map((preset, index) => (
            <Button
              key={index}
              onClick={() => loadPreset(preset)}
              variant="outline"
              size="sm"
            >
              {preset.topic || "Reference Only"}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="ai-topic"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Topic (optional)
          </label>
          <Input
            id="ai-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Algebra, Geometry, Calculus"
          />
        </div>

        <div>
          <label
            htmlFor="ai-referenceQuestion"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Reference Question (optional)
          </label>
          <Textarea
            id="ai-referenceQuestion"
            value={referenceQuestion}
            onChange={(e) => setReferenceQuestion(e.target.value)}
            placeholder="Enter a sample question or describe the type of problem..."
            rows={3}
          />
        </div>

        <div className="text-sm text-muted-foreground bg-accent p-3 rounded-md">
          <strong>Note:</strong> Provide a topic, reference question, or both
          for best results.
        </div>

        <div>
          <label
            htmlFor="ai-numQuestions"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Number of Questions (1-5)
          </label>
          <Input
            id="ai-numQuestions"
            type="number"
            min="1"
            max="5"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ai-isPublic"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="ai-isPublic" className="text-sm font-medium">
            Make problems public
          </Label>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !canGenerate}
          className="w-full"
        >
          {loading
            ? "Generating..."
            : `Generate ${numQuestions} Problem${
                numQuestions !== 1 ? "s" : ""
              }`}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Replace the manual problem rendering with ProblemDisplay */}
      {result && result.function_call?.function?.arguments?.problems && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Generated Problems (
            {result.function_call.function.arguments.problems.length})
          </h3>

          <div className="grid gap-4">
            {result.function_call.function.arguments.problems.map(
              (problem, index) => (
                <div key={index} className="relative">
                  <ProblemDisplay
                    problem={adaptProblemForDisplay(problem)}
                    className="w-full"
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseAiProblem(problem, index)}
                      className="bg-background/80 backdrop-blur-sm"
                      disabled={
                        !user?.id ||
                        authLoading ||
                        creatingIndexes.has(index) ||
                        createdProblems.has(
                          `${problem.title}|${problem.problem_latex}`
                        )
                      }
                    >
                      {!user?.id ? (
                        "Login Required"
                      ) : createdProblems.has(
                          `${problem.title}|${problem.problem_latex}`
                        ) ? (
                        "Already Used"
                      ) : creatingIndexes.has(index) ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="animate-spin h-4 w-4" />
                          Saving...
                        </div>
                      ) : (
                        "Use Problem"
                      )}
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Show Raw Response (for debugging)
            </summary>
            <div className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}

      {result &&
        (!result.function_call?.function?.arguments?.problems ||
          result.function_call.function.arguments.problems.length === 0) && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              No problems were generated. You can see the raw AI response below.
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Show Raw Response
              </summary>
              <div className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </details>
          </div>
        )}
    </div>
  );
}
