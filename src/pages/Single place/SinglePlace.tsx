import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useTitle from "../../hooks/useChangePageTitle";
import { TPlaceDetails } from "../../types";
import { LocateFixed, User, Heart } from "lucide-react";
import { Button } from "flowbite-react";
import SinglePlaceSkeleton from "../../animations/skeletons/SinglePlaceSkeleton";
import axiosInstance from "../../api/axiosInstance";
import SinglePlaceComments from "./SinglePlaceComments";
import { renderStars } from "../../utils/functions";
import GuideCard from "./GuideCard";
import { useState, useEffect } from "react";
import { handleFavoriteToggleApi } from "../../utils/api";
import { UserRoles } from "../../constants/enums";
import { X, ZoomIn } from "lucide-react";

export default function SinglePlace() {
  const { name } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const nav = useNavigate();
  useTitle(`Place - ${name}`);
  const { token, role } = useAppSelector((state) => state.auth);
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
    if (!token) return nav("/login");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {isPending && <SinglePlaceSkeleton />}
      {data && (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
          {" "}
          {/* Hero Section with Image and Basic Info */}
          <div className="relative mb-8">
            <div
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={data?.photo}
                alt={data?.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </div>
              {/* Floating Info Card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {data.name}
                      </h1>
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <LocateFixed size={20} />
                        <span className="text-lg font-medium">
                          {data.governmentName}
                        </span>
                      </div>
                    </div>

                    {/* Rating and Favorite */}
                    <div className="flex items-center gap-4">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-md">
                        <div className="flex items-center gap-2">
                          {renderStars(data.googleRate || 0)}
                          <span className="text-sm font-semibold text-gray-700">
                            {data?.googleRate?.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {role !== UserRoles.ADMIN &&
                        role !== UserRoles.TOUR_GUIDE && (
                          <button
                            onClick={handleFavoriteToggle}
                            disabled={isUpdatingFavorite}
                            className={`p-3 bg-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110 ${
                              isUpdatingFavorite
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-xl active:scale-95"
                            }`}
                            title={
                              isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
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
                        )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                      {data.visitingHours}
                    </div>
                    <Link to={`${data.location}`} target="_blank">
                      <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        <LocateFixed size={16} className="mr-2" />
                        View on Map
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Place
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {data.description}
                </p>
              </div>

              {/* Tourism Types Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tourism Types
                </h2>
                <div className="flex flex-wrap gap-3">
                  {data?.typeOfTourism.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Side Info */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Google Rating</span>
                    <div className="flex items-center gap-1">
                      {renderStars(data.googleRate || 0)}
                      <span className="font-semibold ml-1">
                        {data?.googleRate?.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {data.userRates && data.userRates.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User Reviews</span>
                      <span className="font-semibold text-blue-600">
                        {data.userRates.length} reviews
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-green-600">
                      {data.governmentName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Visiting Hours</span>
                    <span className="font-semibold text-purple-600">
                      {data.visitingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Tours Card */}
              {data?.tourguids && data.tourguids.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Available Tours
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {data.tourguids.length}
                    </div>
                    <p className="text-gray-600">
                      Professional tour guides available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Tour Guides Section */}
          {data?.tourguids && data.tourguids.length > 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
            </div>
          )}{" "}
          {/* Enhanced Comments Section */}
          <div className="mt-8">
            <SinglePlaceComments data={data} />
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={data?.photo}
              alt={data?.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="text-white text-xl font-semibold bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                {data?.name}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
