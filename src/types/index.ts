export type TLoading = "idle" | "pending" | "succeeded" | "failed";
export type TPlaceHome = {
  id: number;
  name: string;
  photo: string;
  rate?: number;
};
