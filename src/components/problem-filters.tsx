"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProblemFiltersProps {
  classroomNames: string[];
}

export default function ProblemFilters({
  classroomNames,
}: ProblemFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const visibility = searchParams.get("visibility") || "all";
  const classroom = searchParams.get("classroom") || "all";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
      <div>
        <p className="text-sm text-gray-500 mb-2">Visibility</p>
        <div className="flex gap-2">
          {["all", "public", "private"].map((option) => (
            <Button
              key={option}
              variant={visibility === option ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("visibility", option)}
              className="capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {classroomNames.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Classroom</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={classroom === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("classroom", "all")}
            >
              All
            </Button>
            <Button
              variant={classroom === "none" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("classroom", "none")}
            >
              No Classroom
            </Button>
            {classroomNames.map((name) => (
              <Button
                key={name}
                variant={classroom === name ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter("classroom", name)}
                className="whitespace-nowrap"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {(visibility !== "all" || classroom !== "all") && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {visibility !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {visibility}
            </Badge>
          )}
          {classroom !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {classroom === "none" ? "No Classroom" : classroom}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/created-problems")}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
