export type TLoading = "idle" | "pending" | "succeeded" | "failed";
export type TPlaceHome = {
  id: number;
  name: string;
  photo: string;
  googleRate?: number;
};
export type TTourism = {
  id: number;
  name: string;
  photo: string;
};
export type TGovernorate = {
  name: string;
  photo: string;
};

export type TPlaceDetails = {
  name: string;
  photo: string;
  location: string;
  visitingHours: string;
  googleRate: number;
  description: string;
  governmentName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tourguids: any[];
  typeOfTourism: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userRates: any[];
};
export type NumberInputField =
  | "stay_duration"
  | "spending_usd"
  | "travel_frequency"
  | "avg_spending_accommodation"
  | "avg_spending_transport"
  | "avg_spending_food"
  | "avg_cost_per_day_aed";

export type SelectField =
  | "with_family"
  | "accommodation_type"
  | "preferred_destination"
  | "travel_purpose";
