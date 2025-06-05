import { z } from "zod";

export const ClassroomSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  ownerId: z.string().nonempty("Owner ID is required"),
});

export type Classroom = z.infer<typeof ClassroomSchema>;
