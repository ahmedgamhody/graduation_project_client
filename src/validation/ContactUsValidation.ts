import { z } from "zod";

export const ContactUsSchema = z.object({
  problem: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

export type ContactUsFormData = z.infer<typeof ContactUsSchema>;
