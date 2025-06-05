"use client";

import MathRenderer from "@/components/math-renderer";

interface ProblemDescriptionRendererProps {
  content: string;
  className?: string;
}

export default function ProblemDescriptionRenderer({
  content,
  className = "",
}: ProblemDescriptionRendererProps) {
  if (!content) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        No content to display
      </div>
    );
  }

  const parts = content.split(/(\$\$[^$]*\$\$)/g);

  return (
    <div className={`space-y-2 ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          // This is a LaTeX expression
          const latex = part.slice(2, -2); // Remove $$ markers
          if (latex.trim()) {
            return (
              <div key={index} className="my-4">
                <MathRenderer latex={latex} displayMode={true} />
              </div>
            );
          }
          return null;
        } else {
          // This is regular text
          const trimmedPart = part.trim();
          if (trimmedPart) {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {trimmedPart}
              </div>
            );
          }
          return null;
        }
      })}
    </div>
  );
}
