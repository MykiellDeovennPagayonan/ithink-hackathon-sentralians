/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugStateProps {
  data: Record<string, any>;
  title?: string;
}

export default function DebugState({
  data,
  title = "Debug State",
}: DebugStateProps) {
  const [isVisible, setIsVisible] = useState(
    process.env.NODE_ENV === "development"
  );

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="border-yellow-500 shadow-lg">
        <CardHeader className="py-2 bg-yellow-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-yellow-800">
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 text-xs bg-yellow-50/50 max-h-[300px] overflow-auto">
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
