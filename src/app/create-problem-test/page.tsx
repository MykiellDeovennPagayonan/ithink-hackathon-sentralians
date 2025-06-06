'use client';

import React, { useState } from 'react';
import { generateProblems } from '@/utils/generateProblems';
import ProblemDisplay from '@/components/problem/problem-display';

interface Problem {
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

const adaptProblemForDisplay = (problem: Problem, index: number) => ({
  id: `generated-${index}`,
  title: `${problem.topic} Problem ${index + 1}`,
  description: problem.problem_latex,
  category: problem.topic,
  difficulty: problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase(),
  isPublic: true,
  createdAt: new Date(),
});

export default function ProblemGenerator() {
  const [topic, setTopic] = useState('');
  const [referenceQuestion, setReferenceQuestion] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() && !referenceQuestion.trim()) {
      setError('Please provide either a topic or a reference question (or both)');
      return;
    }

    if (numQuestions < 1 || numQuestions > 5) {
      setError('Number of questions must be between 1 and 5');
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
      setError(err instanceof Error ? err.message : 'Failed to generate problems');
    } finally {
      setLoading(false);
    }
  };

  const presetExamples = [
    {
      topic: 'Algebra',
      question: 'Solve for x: 2x + 5 = 13'
    },
    {
      topic: 'Geometry',
      question: 'Find the area of a triangle with base 8 and height 6'
    },
    {
      topic: 'Calculus',
      question: 'Find the derivative of f(x) = x² + 3x - 2'
    },
    {
      topic: 'Statistics',
      question: ''
    },
    {
      topic: '',
      question: 'What is 15% of 240?'
    }
  ];

  const loadPreset = (preset: typeof presetExamples[0]) => {
    setTopic(preset.topic);
    setReferenceQuestion(preset.question);
  };

  const canGenerate = topic.trim() || referenceQuestion.trim();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          AI Problem Generator
        </h2>

        {/* Preset Examples */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Examples:</h3>
          <div className="flex flex-wrap gap-2">
            {presetExamples.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {preset.topic || 'Reference Only'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic (optional)
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Algebra, Geometry, Calculus, Statistics"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="referenceQuestion" className="block text-sm font-medium text-gray-700 mb-2">
              Reference Question (optional)
            </label>
            <textarea
              id="referenceQuestion"
              value={referenceQuestion}
              onChange={(e) => setReferenceQuestion(e.target.value)}
              placeholder="Enter a sample question to base new problems on..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <strong>Note:</strong> Provide at least one of the above (topic or reference question). 
            You can use both together for more targeted problem generation.
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions (1-5, default: 1)
            </label>
            <input
              id="numQuestions"
              type="number"
              min="1"
              max="5"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : `Generate ${numQuestions} Problem${numQuestions !== 1 ? 's' : ''}`}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Generated Problems Display */}
      {result && result.function_call?.function?.arguments?.problems && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Generated Problems ({result.function_call.function.arguments.problems.length})
          </h3>
          
          <div className="grid gap-6">
            {result.function_call.function.arguments.problems.map((problem, index) => (
              <ProblemDisplay
                key={index}
                problem={adaptProblemForDisplay(problem, index)}
                className="w-full"
              />
            ))}
          </div>

          {/* Raw JSON for debugging (collapsible) */}
          <details className="bg-white rounded-lg shadow-lg p-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
              Show Raw Response (for debugging)
            </summary>
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}

      {result && (!result.function_call?.function?.arguments?.problems || result.function_call.function.arguments.problems.length === 0) && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">No problems were generated. Here&lsquo;s the raw response:</p>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}