import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useTitle from "../../hooks/useChangePageTitle";
import { TPlaceDetails } from "../../types";
import { LocateFixed, User, Heart } from "lucide-react";
import { Badge, Button } from "flowbite-react";
import SinglePlaceSkeleton from "../../animations/skeletons/SinglePlaceSkeleton";
import axiosInstance from "../../api/axiosInstance";
import SinglePlaceComments from "./SinglePlaceComments";
import { renderStars } from "../../utils/functions";
import GuideCard from "./GuideCard";
import { useState, useEffect } from "react";
import { handleFavoriteToggleApi } from "../../utils/api";

export default function SinglePlace() {
  const { name } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  useTitle(`Place - ${name}`);
  const token = useAppSelector((state) => state.auth.token);
  const fetchSinglePlace = () =>
    axiosInstance(`/Place/PlacesDetails?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      return data;
    });
  const { data, isPending } = useQuery<TPlaceDetails>({
    queryKey: ["place"],
    queryFn: () => fetchSinglePlace(),
    placeholderData: keepPreviousData,
  });
  // Update local favorite state when data loads
  useEffect(() => {
    if (data?.isFavorite !== undefined) {
      setIsFavorite(data.isFavorite);
    }
  }, [data?.isFavorite]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!token) return;

    try {
      setIsUpdatingFavorite(true);
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      await handleFavoriteToggleApi(token, data?.name || "", isFavorite);
    } catch (error) {
      setIsFavorite(!isFavorite);
      console.error("Error updating favorite:", error);
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  console.log(data);
  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16">
      {isPending && <SinglePlaceSkeleton />}
      {data && (
        <div className="flex flex-col  gap-5">
          <div className="flex justify-center rounded-lg">
            <img
              src={data?.photo}
              alt={data?.name}
              className="rounded-lg max-w-full h-auto"
            />
          </div>{" "}
          <div className="flex justify-between items-center">
            <h1 className="flex items-center gap-1 text-green-600">
              <LocateFixed color="green" size={20} />
              {data.governmentName}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center gap-1">
                {renderStars(data.googleRate || 0)}
                <span className="text-sm text-gray-600 mr-2">
                  ({data?.googleRate?.toFixed(1)})
                </span>
              </div>
              {/* Favorite Heart Icon */}
              <button
                onClick={handleFavoriteToggle}
                disabled={isUpdatingFavorite}
                className={`p-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110 ${
                  isUpdatingFavorite
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 active:scale-95"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  size={24}
                  className={`transition-colors duration-200 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-primary">{data.name}</h1>
            <p className="text-md text-gray-600">{data.description}</p>
            <div>
              <h1 className="text-lg font-bold text-secondary">
                Type of Tourism
              </h1>
              <div className="flex gap-3 mt-3">
                {data?.typeOfTourism.map((item, index) => (
                  <Badge key={index} color="info" className="text-md p-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-md text-primary"> {data.visitingHours}</p>
              <Link to={`${data.location}`} target="_blank">
                <Button className="bg-secondary enabled:hover:bg-primary !important">
                  Show location
                </Button>
              </Link>
            </div>
          </div>
          {data?.tourguids && data.tourguids.length > 0 && (
            <h2 className="text-3xl font-semibold text-secondary my-3 text-center">
              Tour Guides
            </h2>
          )}
          {data?.tourguids && data.tourguids.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                Available Tour Guides
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.tourguids.map((guide, index) => (
                  <GuideCard key={index} guide={guide} />
                ))}
              </div>
            </div>
          )}
          <SinglePlaceComments data={data} />
        </div>
      )}
    </div>
  );
}
