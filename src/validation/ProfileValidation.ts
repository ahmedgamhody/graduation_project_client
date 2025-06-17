import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

export const tourGuideProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  allLangues: z
    .array(z.string(), {
      required_error: "You must select at least one language",
    })
    .min(1, "You must select at least one language"),
});
export type TourGuideProfileFormData = z.infer<typeof tourGuideProfileSchema>;

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
