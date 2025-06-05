"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Brain className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              We apologize for the inconvenience. Please try again or return to
              the homepage.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="text-left mb-8 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-sm text-red-600 whitespace-pre-wrap break-words">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => reset()} className="h-12 px-8">
                Try Again
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
