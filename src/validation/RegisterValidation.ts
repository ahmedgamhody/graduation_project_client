import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
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
  age: z.coerce
    .number()
    .min(1, { message: "Age must be at least 1" })
    .max(100, { message: "Age must be less than or equal to 100" }),

  gender: z.enum(["male", "female"], { message: "Select a gender" }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
