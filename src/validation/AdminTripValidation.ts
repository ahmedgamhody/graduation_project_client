import { z } from "zod";

export const AddTripSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters long"),
  price: z.number().min(1, "Price must be at least $1"),
  days: z.number().min(1, "Days must be at least 1"),
  programName: z
    .string()
    .min(3, "Program name must be at least 3 characters long"),
  tripsPlaces: z
    .array(z.string())
    .min(1, "At least one trip place must be selected"),
});
export const UpdateTripSchema = z.object({
  description: z
    .string()
    .min(15, "Description must be at least 15 characters long"),
  price: z.number().min(1, "Price must be at least $1"),
  days: z.number().min(1, "Days must be at least 1"),
  programName: z
    .string()
    .min(3, "Program name must be at least 3 characters long"),
  trips_Places: z
    .array(z.string())
    .min(1, "At least one trip place must be selected"),
});

export type UpdateTripFormData = z.infer<typeof UpdateTripSchema>;
export type AddTripFormData = z.infer<typeof AddTripSchema>;
