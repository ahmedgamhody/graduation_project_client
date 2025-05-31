import { useParams } from "react-router-dom";
import useTitle from "../../../hooks/useChangePageTitle";
import { useAppSelector } from "../../../store/hooks";
import axiosInstance from "../../../api/axiosInstance";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TTripDetails } from "../../../types";
import PlaceCard from "../../homePage/AllPlaces/PlaceCard";
import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import TripInfoSkeleton from "../../../animations/skeletons/TripInfoSkeleton";

export default function TripDetails() {
  const { name } = useParams();
  useTitle(`Trip Details - ${name}`);
  const token = useAppSelector((state) => state.auth.token);
  const fetchSinglePlace = () =>
    axiosInstance(`/Programes/Trip-Details?TripName=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      console.log(data);
      return data;
    });

  const { data, isPending } = useQuery<TTripDetails>({
    queryKey: ["tripDetails", name],
    queryFn: () => fetchSinglePlace(),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold text-center text-primary">
        {name} Trip Details
      </h1>

      {isPending ? (
        <TripInfoSkeleton />
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-xl my-10">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 flex gap-2 items-center">
            <strong className="text-primary">Program:</strong>{" "}
            <p className="bg-secondary text-white px-2 py-1 rounded">
              {data?.name}
            </p>
          </p>
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            <strong className="text-primary">Description:</strong>{" "}
            {data?.description}
          </p>
          <div className="flex flex-wrap gap-6 text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-primary">🗓️ Days:</strong> {data?.days}
            </p>
            <p>
              <strong className="text-primary">📍 Sites:</strong>{" "}
              {data?.number_of_Sites}
            </p>
            <p>
              <strong className="text-primary">💰 Price:</strong>{" "}
              {data?.price.toFixed(2)}$
            </p>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-secondary mb-8 text-center">
        Trip Places
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {data?.tripPlaces.map((place, idx) => (
          <PlaceCard place={place} key={idx} />
        ))}

        {isPending &&
          Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}
