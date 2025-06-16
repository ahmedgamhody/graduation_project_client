import { z } from "zod";

export const MachineQuestionsSchema = z.object({
  with_family: z.enum(["With Family", "Without Family"], {
    message: "With family is required",
  }),
  travel_purpose: z.enum(["Business", "Education", "Leisure", "Medical"], {
    message: "Travel Purpose is required",
  }),
  preferred_destination: z.enum(
    ["Adventure Park", "Beach", "City", "Countryside", "Mountain"],
    { message: "Preferred Destination is required" }
  ),
  accommodation_type: z.enum(["Airbnb", "Hostel", "Hotel", "Resort"], {
    message: "Accommodation Type is required",
  }),
  stay_duration: z.coerce
    .number()
    .min(1, { message: "Stay Duration must be at least 1" })
    .max(100, { message: "Stay Duration must be less than or equal to 100" }),
  spending_usd: z.coerce
    .number()
    .min(1, { message: "Spending must be at least 1" })
    .max(100000, { message: "Spending must be less than or equal to 100000" }),
  travel_frequency: z.coerce
    .number()
    .min(1, { message: "Travel Frequency must be at least 1" })
    .max(100, {
      message: "Travel Frequency must be less than or equal to 100",
    }),
  avg_spending_accommodation: z.coerce
    .number()
    .min(1, { message: "Average Spending on Accommodation is required" })
    .max(100000, {
      message:
        "Average Spending on Accommodation must be less than or equal to 100000",
    }),
  avg_spending_transport: z.coerce
    .number()
    .min(1, { message: "Average Spending on Transport is required" })
    .max(100000, {
      message:
        "Average Spending on Transport must be less than or equal to 100000",
    }),
  avg_spending_food: z.coerce
    .number()
    .min(1, { message: "Average Spending on Food is required" })
    .max(100000, {
      message: "Average Spending on Food must be less than or equal to 100000",
    }),
  avg_cost_per_day_aed: z.coerce
    .number()
    .min(1, { message: "Average Cost Per Day is required" })
    .max(100000, {
      message: "Average Cost Per Day must be less than or equal to 100000",
    }),
});

export type MachineQuestionsFormData = z.infer<typeof MachineQuestionsSchema>;
