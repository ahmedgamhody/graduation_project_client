import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { TTripPlace } from "../../types";
import TripPlacesSection from "../Recommendation/TripPlacesSection";

export default function AllTripsForTourGuide() {
  const fetchAllTripsPlaces = () =>
    axiosInstance(`/Tourguid/DisplayAllTrips`).then((res) => {
      const data = res.data.trips;
      return data;
    });

  const { data } = useQuery<TTripPlace[]>({
    queryKey: ["TripsPlaces TourGuide"],
    queryFn: () => fetchAllTripsPlaces(),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="mb-10">
      <TripPlacesSection allTripPlacesFromAdmin={data} />
    </div>
  );
}
