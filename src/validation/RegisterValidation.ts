import { z } from "zod";

export const RegisterSchema = z.object({
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
  country: z.string().min(1, { message: "Country is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),

  birthDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      return !isNaN(date.getTime()) && date <= now;
    },
    {
      message: "Please enter a valid birth date that is not in the future",
    }
  ),
  language: z.string().min(1, { message: "Language is required" }),

  gender: z.enum(["male", "female"], { message: "Select a gender" }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
