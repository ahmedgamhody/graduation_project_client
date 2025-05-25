import { z } from "zod";
import {
  AllPlacesName,
  AllTripsName,
  languageCodes,
} from "../pages/registerPage";

export const UserRegisterSchema = z.object({
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

export type UserRegisterFormData = z.infer<typeof UserRegisterSchema>;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const TourGuideRegisterSchema = z.object({
  Name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  Email: z.string().email({ message: "Invalid email address" }),
  Password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  Country: z.string().min(1, { message: "Country is required" }),
  Phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),

  BirthDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      return !isNaN(date.getTime()) && date <= now;
    },
    {
      message: "Please enter a valid birth date that is not in the future",
    }
  ),
  Gender: z.enum(["male", "female"], { message: "Select a gender" }),
  image: z
    .any()
    .refine((file) => file?.length === 1, "Profile image is required")
    .refine(
      (file) => file?.[0]?.type?.startsWith("image/"),
      "Profile image must be an image file"
    )
    .refine(
      (file) => file?.[0]?.size <= MAX_FILE_SIZE,
      "Profile image must be less than 10MB"
    ),

  Cvfile: z
    .any()
    .refine((file) => file?.length === 1, "CV is required")
    .refine(
      (file) => file?.[0]?.type === "application/pdf",
      "CV must be a PDF file"
    )
    .refine(
      (file) => file?.[0]?.size <= MAX_FILE_SIZE,
      "CV must be less than 10MB"
    ),
  TripName: z.enum(AllTripsName, { message: " Trip Name is required" }),
  PlaceName: z.enum(AllPlacesName, { message: " Place Name is required" }),
  AllLangues: z
    .array(z.enum(languageCodes))
    .min(1, { message: "Please select at least one language" }),
});

export type TourGuideRegisterFormData = z.infer<typeof TourGuideRegisterSchema>;
