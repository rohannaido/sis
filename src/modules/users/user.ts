import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
  role: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
