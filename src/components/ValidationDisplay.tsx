"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Calculator } from "lucide-react";
import ProblemDescriptionRenderer from "@/components/problem-description-renderer";
import { evaluate } from 'mathjs';
import { useState } from 'react';

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

// Helper function to safely evaluate mathjs expressions
const safeEvaluate = (expression: string): { result: string | number; error?: string; hasError: boolean } => {
  try {
    if (!expression || expression.trim() === '') {
      return { result: 'No calculation provided', hasError: true };
    }
    
    const result = evaluate(expression);
    
    // Format the result nicely
    if (typeof result === 'number') {
      // Round to reasonable decimal places for display
      const rounded = Math.abs(result) > 1000 
        ? result.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : parseFloat(result.toFixed(6));
      return { result: rounded, hasError: false };
    }
    
    return { result: result.toString(), hasError: false };
  } catch (error) {
    return { 
      result: 'Calculation error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      hasError: true
    };
  }
};

export default function ValidationDisplay({ validation }: ValidationDisplayProps) {
  const { process, steps, where_wrong } = validation.function_call.function.arguments;
  const hasErrors = where_wrong && where_wrong.length > 0;
  const [showCalculations, setShowCalculations] = useState(true);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalculations(!showCalculations)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Calculator className="w-4 h-4" />
              {showCalculations ? 'Hide' : 'Show'} Calculations
            </button>
            <Badge variant={hasErrors ? "destructive" : "default"}>
              {hasErrors ? "Needs Improvement" : "Correct"}
            </Badge>
          </div>
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
            {steps.map((step, index) => {
              const calculation = safeEvaluate(step.mathjs);
              
              return (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="outline" className="mt-0.5">
                      Step {step.step_number}
                    </Badge>
                    <p className="text-gray-700 flex-1">{step.description}</p>
                  </div>
                  
                  {/* LaTeX Formula */}
                  {step.latex && (
                    <div className="bg-gray-50 rounded-md p-3 mt-2">
                      <div className="font-mono text-sm">
                        <ProblemDescriptionRenderer content={step.latex} />
                      </div>
                    </div>
                  )}
                  
                  {/* Mathematical Calculation - Only show if no error and calculations are enabled */}
                  {showCalculations && step.mathjs && !calculation.hasError && (
                    <div className="mt-2 space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Calculation:</span>
                        </div>
                        <code className="text-sm text-blue-700 block mb-2">
                          {step.mathjs}
                        </code>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-blue-800">Result:</span>
                          <span className="font-mono font-bold text-blue-900">
                            {calculation.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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