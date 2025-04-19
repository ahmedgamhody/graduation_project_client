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
