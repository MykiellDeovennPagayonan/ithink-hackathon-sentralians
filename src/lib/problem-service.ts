"use client";

import { z } from "zod";

export const problemSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").nullable().optional(),
  classroomId: z.string().nullable().optional(),
  isPublic: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export type Problem = z.infer<typeof problemSchema>;

// Mock function to create a problem (replace with actual API call)
export async function createProblem(
  problem: Omit<Problem, "id" | "createdAt">
): Promise<Problem> {
  // In a real app, this would be an API call to your backend
  console.log("Creating problem:", problem);

  // Simulate API response
  return {
    ...problem,
    id: `prob_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };
}

// Mock function to get a problem by ID (replace with actual API call)
export async function getProblem(id: string): Promise<Problem | null> {
  // In a real app, this would be an API call to your backend
  console.log("Fetching problem:", id);

  // Simulate API response
  if (id === "example") {
    return {
      id: "example",
      title: "Quadratic Equation Example",
      description:
        "Solve the quadratic equation: $$ax^2 + bx + c = 0$$ for $$a=1$$, $$b=5$$, and $$c=6$$.",
      imageUrl: null,
      classroomId: null,
      isPublic: true,
      createdAt: new Date(),
    };
  }

  return null;
}

// Mock function to list problems (replace with actual API call)
export async function listProblems(options?: {
  classroomId?: string | null;
  isPublic?: boolean;
  limit?: number;
}): Promise<Problem[]> {
  // In a real app, this would be an API call to your backend
  console.log("Listing problems with options:", options);

  // Simulate API response
  return [
    {
      id: "prob_1",
      title: "Quadratic Equations",
      description:
        "Solve quadratic equations using the quadratic formula: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
      imageUrl: null,
      classroomId: options?.classroomId || null,
      isPublic: true,
      createdAt: new Date(),
    },
    {
      id: "prob_2",
      title: "Pythagorean Theorem",
      description:
        "Apply the Pythagorean theorem $$a^2 + b^2 = c^2$$ to solve right triangle problems.",
      imageUrl: null,
      classroomId: options?.classroomId || null,
      isPublic: true,
      createdAt: new Date(),
    },
  ];
}
