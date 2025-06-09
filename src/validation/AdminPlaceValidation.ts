import { z } from "zod";
import {
  allGovernorates,
  allTypesOfTourism,
  visitingHoursOptions,
} from "../pages/admin dashboard";

export const UpdatePlaceSchema = z.object({
  photo: z.string().url({ message: "Photo must be a valid URL" }),
  description: z.string().min(15, "Description is required"),
  visitingHours: z.enum(visitingHoursOptions, {
    message: "Visiting hours is required",
  }),
  googleRate: z
    .number({
      invalid_type_error: "Google rate must be a number",
    })
    .min(0, "Rate must be at least 0")
    .max(5, "Rate can't exceed 5"),
});

export const AddPlaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  photo: z.string().url({ message: "Photo must be a valid URL" }),
  description: z.string().min(15, "Description is required"),
  visitingHours: z.enum(visitingHoursOptions, {
    message: "Visiting hours is required",
  }),
  googleRate: z
    .number({
      invalid_type_error: "Google rate must be a number",
    })
    .min(0, "Rate must be at least 0")
    .max(5, "Rate can't exceed 5"),
  location: z.string().url({ message: "Location must be a valid URL" }),
  governmentName: z.enum(allGovernorates, {
    message: " Governorate is required",
  }),
  typeOfTourism: z
    .array(z.enum(allTypesOfTourism))
    .min(1, "At least one type of tourism must be selected")
    .max(allTypesOfTourism.length, "Too many types selected"),
});
export type AddPlaceFormData = z.infer<typeof AddPlaceSchema>;
export type UpdatePlaceFormData = z.infer<typeof UpdatePlaceSchema>;
