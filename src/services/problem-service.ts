import { backend } from "@/declarations/backend";
import {
  ProblemInput,
  ProblemInputSchema,
} from "../lib/zod-schema/problem-schema";
import { toCandidOpt } from "@/utils/candid";
import {
  Problem,
  ProblemWithClassroom,
} from "@/declarations/backend/backend.did";

export async function createProblem(
  problem: ProblemInput,
  userId: string
): Promise<Problem> {
  try {
    console.log("Creating problem:", problem);

    const parsedClassroom = ProblemInputSchema.safeParse(problem);
    if (!parsedClassroom.success) {
      console.error("Invalid classroom data:", parsedClassroom.error);
      throw new Error("Invalid classroom data");
    }

    const result = await backend.createProblem({
      ...problem,
      id: [],
      classroomId: toCandidOpt(problem.classroomId),
      imageUrl: toCandidOpt(problem.imageUrl),
      creatorId: userId,
    });

    if ("err" in result) {
      throw new Error(result.err);
    }

    return result.ok;
  } catch (error) {
    console.error("Error creating problem:", error);
    throw error;
  }
}

export async function getProblemById(id: string): Promise<Problem | null> {
  try {
    console.log("Fetching problem by ID:", id);

    const result = await backend.getProblemById(id);

    if (result.length === 0) {
      console.error("Problem not found");
      return null;
    }

    return result[0];
  } catch (error) {
    console.error("Error fetching problem by ID:", error);
    return null;
  }
}

export async function getProblemsByUserId(
  userId: string
): Promise<Problem[] | null> {
  try {
    console.log("Fetching problem by user ID:", userId);

    const result = await backend.getProblemsByUserId(userId);

    if (result.length === 0) {
      console.error("Problem not found for user ID:", userId);
      return null;
    }

    return result;
  } catch (error) {
    console.error("Error fetching problem by user ID:", error);
    return null;
  }
}

export async function getAllProblems(userId: string): Promise<Problem[]> {
  try {
    console.log("Fetching all problems");

    const result = await backend.getProblemsByCreator(userId);

    if ("err" in result) {
      console.error("Error fetching problems:", result.err);
      return [];
    }

    return result;
  } catch (error) {
    console.error("Error fetching all problems:", error);
    return [];
  }
}

export async function getAllUserProblemsWithClassroom(
  userId: string
): Promise<ProblemWithClassroom[]> {
  try {
    console.log("Fetching all problems created by user:", userId);

    const result = await backend.getAllUserProblems(userId);

    if ("err" in result) {
      console.error("Error fetching created problems:", result.err);
      return [];
    }

    return result;
  } catch (error) {
    console.error("Error fetching user created problems:", error);
    return [];
  }
}

export async function getPublicProblems(): Promise<Problem[]> {
  try {
    console.log("Fetching all public problems");

    const result = await backend.getPublicProblems();

    if ("err" in result) {
      console.error("Error fetching public problems:", result.err);
      return [];
    }

    return result;
  } catch (error) {
    console.error("Error fetching public problems:", error);
    return [];
  }
}