"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, BookOpen, TrendingUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockProblems, categories } from "@/mockdata/problems";

export default function ExplorePage() {
  const [classroomCode, setClassroomCode] = useState("");
  const [problemCode, setProblemCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleClassroomJoin = () => {
    if (classroomCode.trim()) {
      router.push(`/classroom/${classroomCode}`);
    }
  };

  const handleProblemJoin = () => {
    if (problemCode.trim()) {
      router.push(`/problem/${problemCode}`);
    }
  };

  const filteredProblems = mockProblems.filter((problem) => {
    const matchesCategory =
      selectedCategory === "All" || problem.category === selectedCategory;
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProblemCountForCategory = (category: string) => {
    if (category === "All") return mockProblems.length;
    return mockProblems.filter((problem) => problem.category === category)
      .length;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Discover AI-powered learning experiences
          </h1>
        </div>

        {/* Code Entry Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Enter Code for Classroom
              </CardTitle>
              <CardDescription className="text-sm">
                Join an existing classroom with your access code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter classroom code..."
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="text-center text-base sm:text-lg h-12"
                onKeyPress={(e) => e.key === "Enter" && handleClassroomJoin()}
              />
              <Button
                onClick={handleClassroomJoin}
                className="w-full h-12"
                disabled={!classroomCode.trim()}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Classroom
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Enter Code for Problem
              </CardTitle>
              <CardDescription className="text-sm">
                Access a specific problem with your code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter problem code..."
                value={problemCode}
                onChange={(e) => setProblemCode(e.target.value)}
                className="text-center text-base sm:text-lg h-12"
                onKeyPress={(e) => e.key === "Enter" && handleProblemJoin()}
              />
              <Button
                onClick={handleProblemJoin}
                className="w-full h-12"
                disabled={!problemCode.trim()}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Access Problem
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Categories and Search */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full text-xs sm:text-sm h-8 sm:h-9"
                >
                  {category} ({getProblemCountForCategory(category)})
                </Button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80 h-10"
                />
              </div>
              <Button className="h-10 whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Create Problem
              </Button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Publicly Available Problems
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProblems.length} problem
              {filteredProblems.length !== 1 ? "s" : ""} found
            </span>
          </div>

          <div className="grid gap-2">
            {filteredProblems.map((problem) => (
              <Card
                key={problem.id}
                className="hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => router.push(`/problem/${problem.id}`)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {problem.category}
                          </Badge>
                          <Badge
                            className={`text-xs px-1.5 py-0.5 ${getDifficultyColor(problem.difficulty)}`}
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-1 mb-2">
                        {problem.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="hidden xs:inline">
                            {problem.participants.toLocaleString()}
                          </span>
                          <span className="xs:hidden">
                            {(problem.participants / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${getCompletionRateColor(problem.completionRate)}`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {problem.completionRate}% completed
                        </div>
                        <div className="hidden sm:flex items-center gap-1">
                          Created by {problem.createdBy}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Solve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
