import axios from "axios";
import { TPlaceHome } from "../types";

type PlaceResponse = {
  items: TPlaceHome[];
  totalPages: number;
};

export const getPlaces = async (
  page: number,
  token: string,
  limitPerPage: number
): Promise<PlaceResponse> => {
  const response = await axios(
    `https://localhost:7214/api/Place/DisplayAllPlacesByPagnation?pageNumber=${page}&pageSize=${limitPerPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
