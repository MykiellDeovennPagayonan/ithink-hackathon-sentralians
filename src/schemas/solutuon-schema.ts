import { z } from "zod";

export const SolutionInputSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Solution content is required"),
  attachmentUrl: z
    .string()
    .url("attachmentUrl must be a valid URL")
    .optional(),
});

export type SolutionInput = z.infer<typeof SolutionInputSchema>;
