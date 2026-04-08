import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(500, "Body must be under 500 characters"),
});

export type PostFormData = z.infer<typeof postSchema>;