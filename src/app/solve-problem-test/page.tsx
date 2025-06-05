'use client';

import React, { useState } from 'react';
import { solveProblem } from '@/utils/solveProblem';

interface Step {
  description: string;
  latex: string;
  mathjs: string;
  step_number: number;
}

interface SolveResult {
  function_call: {
    function: {
      name: string;
      arguments: {
        process: string;
        steps: Step[];
      };
    };
    id: string;
    type: string;
  };
}

export default function ProblemSolver() {
  const [question, setQuestion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<SolveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await solveProblem(
        question,
        imageUrl.trim() || undefined
      );
      setResult(response as unknown as SolveResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve problem');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render LaTeX-like expressions in a more readable way
  const renderMathExpression = (latex: string) => {
    // Basic LaTeX to HTML conversion for better readability
    return latex
      .replace(/\\times/g, '×')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\\\/g, '')
      .replace(/\{([^}]+)\}/g, '$1')
      .replace(/\^(-?\d+)/g, '^$1');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        AI Problem Solver
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Math Question *
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your math question here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSolve}
          disabled={loading || !question.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Solving...' : 'Solve Problem'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && result.function_call?.function?.arguments && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Solution</h3>
          
          {/* Process Overview */}
          {result.function_call.function.arguments.process && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-blue-900 mb-3">
                📋 Solution Process
              </h4>
              <div className="text-gray-800 leading-relaxed">
                {result.function_call.function.arguments.process.split('\\n\\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph.replace(/\\\\/g, '')}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {result.function_call.function.arguments.steps && result.function_call.function.arguments.steps.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">
                🔢 Step-by-Step Solution
              </h4>
              
              {result.function_call.function.arguments.steps.map((step, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step_number}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <p className="text-gray-800 font-medium">
                        {step.description}
                      </p>
                      
                      {/* Mathematical Expression */}
                      <div className="bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Mathematical Expression:
                            </span>
                            <p className="font-mono text-sm text-gray-800 mt-1">
                              {renderMathExpression(step.latex)}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Calculation:
                            </span>
                            <p className="font-mono text-sm text-gray-800 mt-1 bg-white p-2 rounded border">
                              {step.mathjs}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Raw JSON for debugging (collapsible) */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Show Raw Response (for debugging)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}

      {result && (!result.function_call?.function?.arguments || (!result.function_call.function.arguments.process && !result.function_call.function.arguments.steps)) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">The solution format is unexpected. Here&apos;s the raw response:</p>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}