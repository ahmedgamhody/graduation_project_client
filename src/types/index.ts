/* eslint-disable @typescript-eslint/no-explicit-any */
export type TLoading = "idle" | "pending" | "succeeded" | "failed";
export type TPlaceHome = {
  id?: number;
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

export type TComment = {
  id?: number;
  userName?: string;
  comment?: string;
  text?: string;
  content?: string;
  date?: string;
  rating?: number;
  photo?: string;
  userId?: string;
};

export type TPlaceDetails = {
  name: string;
  photo: string;
  location: string;
  visitingHours: string;
  googleRate: number;
  description: string;
  governmentName: string;
  comments: TComment[];
  tourguids: TourGuideCard[];
  typeOfTourism: string[];
  userRates: any[];
  isFavorite: boolean;
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

export type TTripPlace = {
  name: string;
  description: string;
  number_of_Sites: number;
  price: number;
  days: number;
};

export type TTripPlaceDetails = {
  photo: string;
  name: string;
};

export type TTripDetails = {
  name: string;
  description: string;
  price: number;
  days: number;
  number_of_Sites: number;
  programName: string;
  tripPlaces: TTripPlaceDetails[];
  tourguids: any[];
};

export type TUserProfile = {
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  birthDate: string;
  language: string;
  gender: "Male" | "Female" | string;
  photo: string | null;
  tourguid?: string | null;
  favoritePlaces?: string[];
};

export type UserProfileData = {
  name: string;
  country: string;
  language: string;
  tourguid: TourGuideCard;
  phone: string;
  birthDate: string;
  gender: string;
  photo: string;
};

export type TourGuideCard = {
  name: string;
  id: string;
  photo: string;
  rate?: number;
  gender?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  isBooked?: boolean;
};
export type TNotActiveTourGuide = {
  id: string;
  cv: string;
  photo: string;
  name: string;
};

export type TNotActiveTourGuidesData = {
  notActiveTourguids: TNotActiveTourGuide[];
  count: number;
};
