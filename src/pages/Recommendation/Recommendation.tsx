import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { TPlaceHome, TTripPlace } from "../../types";
import { Pagination } from "flowbite-react";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import TripPlaceCard from "./TripPlaceCard";
import useTitle from "../../hooks/useChangePageTitle";
// import { Pagination } from "flowbite-react";

export default function Recommendation() {
  useTitle(`Recommendation`);
  const [recommendationPlacePage, setRecommendationPlacePage] = useState(1);
  const [allTripsPlacePage, setAllTripsPlacePage] = useState(1);
  const [recommendationPlaces, setRecommendationPlaces] = useState<
    TPlaceHome[]
  >([]);
  const [allTripsPlaces, setAllTripsPlaces] = useState<TTripPlace[]>([]);
  const limitPerPage = 6;
  const token = useAppSelector((state) => state.auth.token);
  const fetchAllRecommendationPlaces = () =>
    axiosInstance(`/Programes/Recomend-places`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      setRecommendationPlaces(data);
      return data;
    });

  const { isPlaceholderData: isRecommendationPlaceholder } = useQuery({
    queryKey: ["AllRecommendationPlaces"],
    queryFn: () => fetchAllRecommendationPlaces(),
    placeholderData: keepPreviousData,
  });
  console.log(isRecommendationPlaceholder);
  const fetchAllTripsPlaces = () =>
    axiosInstance(`/Programes/DisplayAllTrips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      setAllTripsPlaces(data);
      return data;
    });

  const { isPlaceholderData: isTripsPlaceholder } = useQuery({
    queryKey: ["TripsPlaces"],
    queryFn: () => fetchAllTripsPlaces(),
    placeholderData: keepPreviousData,
  });
  console.log(isTripsPlaceholder);
  // pagination for recommendation places logic
  const startForRecommendationPlaces =
    limitPerPage * (recommendationPlacePage - 1);
  const endForRecommendationPlaces =
    Number(startForRecommendationPlaces) + Number(limitPerPage);
  const paginatedRecommendationPlaces = recommendationPlaces?.slice(
    startForRecommendationPlaces,
    endForRecommendationPlaces
  );

  // pagination for All trips places logic
  const startForAllTripsPlaces = limitPerPage * (allTripsPlacePage - 1);
  const endForAllTripsPlaces =
    Number(startForAllTripsPlaces) + Number(limitPerPage);
  const paginatedAllTripsPlaces = allTripsPlaces?.slice(
    startForAllTripsPlaces,
    endForAllTripsPlaces
  );

  return (
    <div className="container mx-auto my-5">
      <div className="flex flex-col gap-10">
        <div className="mb-5">
          <h1 className="text-4xl font-bold text-center text-primary mb-8">
            Recommendation Places
          </h1>
          {recommendationPlaces?.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <CardPlaceSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={paginatedRecommendationPlaces?.length}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedRecommendationPlaces?.map(
                    (place: TPlaceHome, index: number) => (
                      <PlaceCard place={place} key={place.id || index} />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
              {recommendationPlaces?.length > limitPerPage && (
                <div className="pagination  flex justify-center mt-8">
                  <Pagination
                    currentPage={recommendationPlacePage}
                    totalPages={Math.ceil(
                      recommendationPlaces?.length / limitPerPage
                    )}
                    onPageChange={(page: number) =>
                      setRecommendationPlacePage(page)
                    }
                    showIcons
                    key={recommendationPlacePage}
                    theme={{
                      pages: {
                        base: "text-xs sm:text-sm flex items-center -space-x-px",
                        showIcon: "inline-flex",
                        previous: {
                          base: "ml-0 mr-2 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        next: {
                          base: " ml-2 mr-0 rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        selector: {
                          base: "w-7 h-7 sm:w-10 sm:h-10 border border-gray-300 bg-white leading-tight text-gray-500 text-xs sm:text-sm enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          active:
                            "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                          disabled: "cursor-not-allowed opacity-50",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-5">
          <h1 className="text-4xl font-bold text-center text-primary mb-8">
            All Trips Places
          </h1>
          {paginatedAllTripsPlaces?.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <CardPlaceSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={paginatedAllTripsPlaces?.length}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedAllTripsPlaces?.map(
                    (tripPlace: TTripPlace, index: number) => (
                      <TripPlaceCard
                        tripPlace={tripPlace}
                        key={tripPlace.description || index}
                      />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
              {allTripsPlaces?.length > limitPerPage && (
                <div className="pagination  flex justify-center mt-8">
                  <Pagination
                    currentPage={allTripsPlacePage}
                    totalPages={Math.ceil(
                      allTripsPlaces?.length / limitPerPage
                    )}
                    onPageChange={(page: number) => setAllTripsPlacePage(page)}
                    showIcons
                    key={allTripsPlacePage}
                    theme={{
                      pages: {
                        base: "text-xs sm:text-sm flex items-center -space-x-px",
                        showIcon: "inline-flex",
                        previous: {
                          base: "ml-0 mr-2 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        next: {
                          base: " ml-2 mr-0 rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        selector: {
                          base: "w-7 h-7 sm:w-10 sm:h-10 border border-gray-300 bg-white leading-tight text-gray-500 text-xs sm:text-sm enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          active:
                            "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                          disabled: "cursor-not-allowed opacity-50",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
