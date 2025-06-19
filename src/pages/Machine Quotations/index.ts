import { NumberInputField, SelectField } from "../../types";

export const preferred_destinationOptions = [
  "Adventure Park",
  "Beach",
  "City",
  "Countryside",
  "Mountain",
];
export const travelPurposeOptions = [
  "Business",
  "Education",
  "Leisure",
  "Medical",
];
export const accommodation_typeOptions = [
  "Airbnb",
  "Hostel",
  "Hotel",
  "Resort",
];
export const numberInputs: {
  name: NumberInputField;
  label: string;
  quotation_number: number;
}[] = [
  {
    name: "stay_duration",
    label: "How many days do you plan to stay?",
    quotation_number: 5,
  },
  {
    name: "spending_usd",
    label: "How much do you plan to spend ?",
    quotation_number: 6,
  },
  {
    name: "travel_frequency",
    label: "Please enter how many times you travel annually (1–100).",
    quotation_number: 7,
  },
  {
    name: "avg_spending_accommodation",
    label: "What is your average spending on accommodation per trip ?",
    quotation_number: 8,
  },
  {
    name: "avg_spending_transport",
    label: "What is your average spending on transportation per trip ?",
    quotation_number: 9,
  },
  {
    name: "avg_spending_food",
    label: "What is your average spending on food per trip ?",
    quotation_number: 10,
  },
  {
    name: "avg_cost_per_day_aed",
    label: "What is your average cost per day during your trip ?",
    quotation_number: 11,
  },
];

export const selectorInputs: {
  name: SelectField;
  label: string;
  quotation_number: number;
  options: string[];
}[] = [
  {
    name: "travel_purpose",
    label: "What is the purpose of your trip?",
    options: travelPurposeOptions,
    quotation_number: 1,
  },
  {
    name: "with_family",
    label: "Will you be traveling with your family?",
    options: ["With Family", "Without Family"],
    quotation_number: 2,
  },
  {
    name: "accommodation_type",
    label: "What type of accommodation do you prefer?",
    options: accommodation_typeOptions,
    quotation_number: 3,
  },
  {
    name: "preferred_destination",
    label: "What type of destination are you interested in?",
    options: preferred_destinationOptions,
    quotation_number: 4,
  },
];
