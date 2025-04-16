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
