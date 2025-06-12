import { z } from "zod";

export const ContactUsSchema = z.object({
  problem: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

export const ReplySchema = z.object({
  replyMessage: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

export type ContactUsFormData = z.infer<typeof ContactUsSchema>;
export type ReplyFormData = z.infer<typeof ReplySchema>;
