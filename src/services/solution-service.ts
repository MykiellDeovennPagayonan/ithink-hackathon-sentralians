import { backend } from "@/declarations/backend";
import {
  Solution,
  SolutionInput,
} from "@/declarations/backend/backend.did";
import { SolutionInputSchema } from "@/schemas/solutuon-schema";

export async function createSolution(
  solution: SolutionInput
): Promise<Solution> {
  try {
    console.log("Creating solution:", solution);

    const parsed = SolutionInputSchema.safeParse(solution);
    if (!parsed.success) {
      console.error("Invalid solution data:", parsed.error);
      throw new Error("Invalid solution data");
    }

    const result = await backend.submitSolution({
      ...solution,
    });

    if ("err" in result) {
      throw new Error(result.err);
    }

    return result.ok;
  } catch (error) {
    console.error("Error creating solution:", error);
    throw error;
  }
}

export async function getSolutionById(id: string): Promise<Solution | null> {
  try {
    console.log("Fetching solution by ID:", id);

    const result = await backend.getSolutionById(id);

    if (!result) {
      console.error("Solution not found");
      return null;
    }

    return result[0] ? result[0] : null;
  } catch (error) {
    console.error("Error fetching solution by ID:", error);
    return null;
  }
}

export async function getSolutionsByProblem(
  problemId: string
): Promise<Solution[]> {
  try {
    console.log("Fetching solutions for problem ID:", problemId);

    const result = await backend.getSolutionsByProblem(problemId);

    return result;
  } catch (error) {
    console.error("Error fetching solutions by problem ID:", error);
    return [];
  }
}

export async function getSolutionsByUser(
  userId: string
): Promise<Solution[]> {
  try {
    console.log("Fetching solutions for user ID:", userId);

    const result = await backend.getSolutionsByUser(userId);

    return result;
  } catch (error) {
    console.error("Error fetching solutions by user ID:", error);
    return [];
  }
}

export async function getCorrectSolutions(
  problemId: string
): Promise<Solution[]> {
  try {
    console.log("Fetching correct solutions for problem ID:", problemId);

    const result = await backend.getCorrectSolutions(problemId);

    return result;
  } catch (error) {
    console.error("Error fetching correct solutions:", error);
    return [];
  }
}

export async function markSolutionAsCorrect(
  id: string
): Promise<void> {
  try {
    console.log("Marking solution as correct, ID:", id);

    const result = await backend.markSolutionAsCorrect(id);

    if ("err" in result) {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error("Error marking solution as correct:", error);
    throw error;
  }
}

export async function updateSolution(
  solution: Solution
): Promise<void> {
  try {
    console.log("Updating solution:", solution);

    const result = await backend.updateSolution(solution);

    if ("err" in result) {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error("Error updating solution:", error);
    throw error;
  }
}

export async function deleteSolution(id: string): Promise<void> {
  try {
    console.log("Deleting solution, ID:", id);

    const result = await backend.deleteSolution(id);

    if ("err" in result) {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error("Error deleting solution:", error);
    throw error;
  }
}
