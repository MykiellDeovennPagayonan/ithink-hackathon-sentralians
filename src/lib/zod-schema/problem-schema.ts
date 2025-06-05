import { z } from "zod";

export const ProblemInputSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").nullable().optional(),
  classroomId: z.string().nullable().optional(),
  isPublic: z.boolean().default(true),
});

export type ProblemInput = z.infer<typeof ProblemInputSchema>;

export const ProblemOutputSchema = ProblemInputSchema.extend({
  createdAt: z.date(),
});

export type ProblemOutput = z.infer<typeof ProblemOutputSchema>;
