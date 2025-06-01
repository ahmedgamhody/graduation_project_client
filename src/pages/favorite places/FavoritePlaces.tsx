import { keepPreviousData, useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import { getAllFavoritePlaces } from "../../utils/api";
import { TPlaceHome } from "../../types";

export default function FavoritePlaces() {
  useTitle(`Favorite Places`);
  const token = useAppSelector((state) => state.auth.token);

  const { data = [], isPending } = useQuery<TPlaceHome[]>({
    queryKey: ["favoritePlaces", token],
    queryFn: () => getAllFavoritePlaces(token),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16 flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-secondary mb-8 text-center">
        Your Favorite Places
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {data.map((place, idx) => (
          <PlaceCard place={place} key={idx} />
        ))}

        {isPending &&
          Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))}
      </div>
      {data.length === 0 && !isPending && (
        <p className="text-gray-500 text-center mt-4">
          You have no favorite places yet.
        </p>
      )}
    </div>
  );
}
