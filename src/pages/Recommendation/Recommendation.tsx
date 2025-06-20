import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { TPlaceHome } from "../../types";
import { Pagination } from "flowbite-react";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import useTitle from "../../hooks/useChangePageTitle";
import TripPlacesSection from "./TripPlacesSection";
import { getUserProgram } from "../../utils/api";
import { CircleCheckBig } from "lucide-react";
// import { Pagination } from "flowbite-react";

export default function Recommendation() {
  useTitle(`Recommendation`);
  const [recommendationPlacePage, setRecommendationPlacePage] = useState(1);
  const [recommendationPlaces, setRecommendationPlaces] = useState<
    TPlaceHome[]
  >([]);
  const [userProgram, setUserProgram] = useState<string | null>(null);
  const [userProgramLoading, setUserProgramLoading] = useState(true);
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

  // pagination for recommendation places logic
  const startForRecommendationPlaces =
    limitPerPage * (recommendationPlacePage - 1);
  const endForRecommendationPlaces =
    Number(startForRecommendationPlaces) + Number(limitPerPage);
  const paginatedRecommendationPlaces = recommendationPlaces?.slice(
    startForRecommendationPlaces,
    endForRecommendationPlaces
  );
  useEffect(() => {
    async function fetchUserProgram() {
      try {
        setUserProgramLoading(true);
        const response = await getUserProgram(token);
        setUserProgram(response);
      } catch (error) {
        console.error("Error fetching user program:", error);
        setUserProgram(null);
      } finally {
        setUserProgramLoading(false);
      }
    }

    if (token) {
      fetchUserProgram();
    } else {
      setUserProgramLoading(false);
    }
  }, [token]);
  console.log("User Program:", userProgram);
  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16 flex flex-col items-center">
      <div className="flex flex-col gap-10">
        {" "}
        {/* User Program Section */}
        {userProgramLoading ? (
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow-lg p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gray-400 rounded-full p-2 w-10 h-10"></div>
                <div className="h-6 bg-gray-400 rounded w-48"></div>
              </div>
              <div className="h-16 bg-gray-400 rounded-lg"></div>
            </div>
          </div>
        ) : userProgram ? (
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <CircleCheckBig className="w-6 h-6 " />
                </div>
                <h2 className="text-xl font-semibold">
                  Your Recommended Program
                </h2>
              </div>
              <p className="text-lg font-medium bg-white bg-opacity-10 rounded-lg px-4 py-3 backdrop-blur-sm">
                {userProgram}
              </p>
            </div>
          </div>
        ) : null}
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
                        base: "text-xs sm:text-sm flex items-center -space-x-px ",
                        showIcon: "inline-flex",
                        previous: {
                          base: "ml-0 mr-2 rounded-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        next: {
                          base: " ml-2 mr-0 rounded-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                          icon: "h-3 w-3 sm:h-5 sm:w-5",
                        },
                        selector: {
                          base: "rounded-md w-7 h-7 sm:w-10 sm:h-10 border border-gray-300 bg-white leading-tight text-gray-500 text-xs sm:text-sm enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
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
        <TripPlacesSection />
      </div>
    </div>
  );
}
