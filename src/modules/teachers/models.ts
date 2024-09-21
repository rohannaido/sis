import { z } from "zod";

export const teacherSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
  role: z.string().min(1),
});

export type Teacher = z.infer<typeof teacherSchema>;
