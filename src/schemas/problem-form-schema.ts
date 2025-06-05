import { z } from "zod";

export const problemFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  classroomId: z.string().optional().or(z.literal("")),
  isPublic: z.boolean(),
});

export type ProblemFormData = z.infer<typeof problemFormSchema>;
