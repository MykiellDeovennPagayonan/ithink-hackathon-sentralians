"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import ProblemDescriptionRenderer from "@/components/problem-description-renderer";

interface ValidationStep {
  step_number: number;
  description: string;
  latex: string;
  mathjs: string;
}

export interface ValidationResult {
  function_call: {
    function: {
      arguments: {
        process: string;
        steps: ValidationStep[];
        where_wrong: string[];
      };
    };
  };
}

interface ValidationDisplayProps {
  validation: ValidationResult;
}

export default function ValidationDisplay({ validation }: ValidationDisplayProps) {
  const { process, steps, where_wrong } = validation.function_call.function.arguments;
  const hasErrors = where_wrong && where_wrong.length > 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                Solution Analysis - Issues Found
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Solution Analysis - Correct
              </>
            )}
          </CardTitle>
          <Badge variant={hasErrors ? "destructive" : "default"}>
            {hasErrors ? "Needs Improvement" : "Correct"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Overview */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Problem Approach</h3>
          <ProblemDescriptionRenderer content={process} className="text-gray-700 leading-relaxed" />
        </div>

        {/* Solution Steps */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Solution Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant="outline" className="mt-0.5">
                    Step {step.step_number}
                  </Badge>
                  <p className="text-gray-700 flex-1">{step.description}</p>
                </div>
                {step.latex && (
                  <div className="bg-gray-50 rounded-md p-3 mt-2 font-mono text-sm">
                    <ProblemDescriptionRenderer content={step.latex} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Errors/Issues */}
        {hasErrors && (
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Issues Identified
            </h3>
            <div className="space-y-2">
              {where_wrong.map((error, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800">{error}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
