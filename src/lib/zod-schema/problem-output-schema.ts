import z from "zod";
import { ProblemInputSchema } from "./problem-input-schema";

export const ProblemOutputSchema = ProblemInputSchema.extend({
  createdAt: z.date(),
});

export type ProblemOutput = z.infer<typeof ProblemOutputSchema>;
