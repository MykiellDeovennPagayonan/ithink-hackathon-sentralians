import { backend } from "@/declarations/backend";
import { ProblemInput } from "../lib/zod-schema/problem-input-schema";
import { toCandidOpt } from "@/utils/candid";

export async function createProblem(
  problem: ProblemInput
): Promise<ProblemInput> {
  console.log("Creating problem:", problem);

  const uuid = crypto.randomUUID();
  await backend.createProblem({
    ...problem,
    id: uuid,
    classroomId: toCandidOpt(problem.classroomId),
    imageUrl: toCandidOpt(problem.imageUrl),
    createdAt: BigInt(Date.now()),
  });

  return {
    ...problem,
    id: uuid,
    createdAt: new Date(Number(Date.now())),
  };
}

// // Mock function to get a problem by ID (replace with actual API call)
// export async function getProblem(id: string): Promise<Problem | null> {
//   // In a real app, this would be an API call to your backend
//   console.log("Fetching problem:", id);

//   // Simulate API response
//   if (id === "example") {
//     return {
//       id: "example",
//       title: "Quadratic Equation Example",
//       description:
//         "Solve the quadratic equation: $$ax^2 + bx + c = 0$$ for $$a=1$$, $$b=5$$, and $$c=6$$.",
//       imageUrl: null,
//       classroomId: null,
//       isPublic: true,
//       createdAt: new Date(),
//     };
//   }

//   return null;
// }

// // Mock function to list problems (replace with actual API call)
// export async function listProblems(options?: {
//   classroomId?: string | null;
//   isPublic?: boolean;
//   limit?: number;
// }): Promise<Problem[]> {
//   // In a real app, this would be an API call to your backend
//   console.log("Listing problems with options:", options);

//   // Simulate API response
//   return [
//     {
//       id: "prob_1",
//       title: "Quadratic Equations",
//       description:
//         "Solve quadratic equations using the quadratic formula: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
//       imageUrl: null,
//       classroomId: options?.classroomId || null,
//       isPublic: true,
//       createdAt: new Date(),
//     },
//     {
//       id: "prob_2",
//       title: "Pythagorean Theorem",
//       description:
//         "Apply the Pythagorean theorem $$a^2 + b^2 = c^2$$ to solve right triangle problems.",
//       imageUrl: null,
//       classroomId: options?.classroomId || null,
//       isPublic: true,
//       createdAt: new Date(),
//     },
//   ];
// }
