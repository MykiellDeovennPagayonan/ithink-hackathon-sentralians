"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function ProblemActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button asChild>
        <Link href="/problem/create">
          <Plus className="h-4 w-4 mr-2" />
          Create Problem
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/classrooms">
          <BarChart3 className="h-4 w-4 mr-2" />
          My Classrooms
        </Link>
      </Button>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
}
