"use client";

import { useEffect, useRef, useState } from "react";
import katex from "katex";

interface MathRendererProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
}

export default function MathRenderer({
  latex,
  className = "",
  displayMode = true,
}: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !latex || !containerRef.current) return;

    try {
      katex.render(latex, containerRef.current, {
        displayMode: displayMode,
        throwOnError: false,
        output: "html",
        trust: true,
        strict: "error",
      });
      setError(null);
    } catch (err) {
      console.error("KaTeX rendering error:", err);
      setError("Error rendering equation");
    }
  }, [latex, displayMode, isMounted]);

  if (!isMounted) {
    return (
      <div className={`text-gray-500 text-center ${className}`}>
        Loading equation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}: {latex}
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
