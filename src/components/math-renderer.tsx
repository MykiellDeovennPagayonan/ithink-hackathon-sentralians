"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";

interface MathJax {
  typesetPromise: (elements?: Element[]) => Promise<void>;
  startup: {
    defaultReady: () => void;
  };
}

declare global {
  interface Window {
    MathJax: MathJax;
  }
}

interface MathRendererProps {
  latex: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MathRenderer({
  latex,
  className = "",
  style = {},
}: MathRendererProps) {
  const [mathRendered, setMathRendered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const equationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !latex) return;

    const renderMath = async () => {
      const checkMathJax = () => {
        return window.MathJax && window.MathJax.typesetPromise;
      };

      if (checkMathJax()) {
        try {
          await window.MathJax.typesetPromise(
            [equationRef.current].filter(Boolean) as Element[]
          );
          setMathRendered(true);
        } catch (err) {
          console.log("MathJax error:", err);
        }
      } else {
        // Wait for MathJax to load
        const interval = setInterval(async () => {
          if (checkMathJax()) {
            clearInterval(interval);
            try {
              await window.MathJax.typesetPromise(
                [equationRef.current].filter(Boolean) as Element[]
              );
              setMathRendered(true);
            } catch (err) {
              console.log("MathJax error:", err);
            }
          }
        }, 100);

        return () => clearInterval(interval);
      }
    };

    renderMath();
  }, [isMounted, latex]);

  if (!isMounted) {
    return (
      <div className={`text-gray-500 text-center ${className}`} style={style}>
        Loading equation...
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={style}>
      {!mathRendered && (
        <div className="text-gray-500 text-xs sm:text-sm mb-2 text-center">
          Rendering equation...
        </div>
      )}
      <div
        ref={equationRef}
        className="w-full overflow-x-auto overflow-y-hidden"
        style={{
          opacity: mathRendered ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
          lineHeight: "1.6",
        }}
      >
        <div className="min-w-max px-2 py-1 text-center">{`$$${latex}$$`}</div>
      </div>
    </div>
  );
}
