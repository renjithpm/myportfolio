import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(80, "That name is a little too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Your message should be at least 10 characters")
    .max(1000, "Please keep it under 1000 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
