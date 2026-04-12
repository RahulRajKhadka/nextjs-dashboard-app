import { z } from "zod";
 

 
export const newPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(1000, "Body must be under 1000 characters"),
});
 
export type NewPostFormData = z.infer<typeof newPostSchema>;
 