import { motion, AnimatePresence } from "framer-motion";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { useState } from "react";
import { TTripPlace } from "../../types";
import TripPlaceCard from "./TripPlaceCard";
import { Pagination } from "flowbite-react";
import axiosInstance from "../../api/axiosInstance";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../store/hooks";

export default function TripPlacesSection({
  allTripPlacesFromAdmin,
  isInAdminDashboard = false,
  handleOpenUpdateTripModal,
}: {
  allTripPlacesFromAdmin?: TTripPlace[];
  isInAdminDashboard?: boolean;
  handleOpenUpdateTripModal?: (tripPlace: TTripPlace) => void;
}) {
  const token = useAppSelector((state) => state.auth.token);
  const [allTripsPlacePage, setAllTripsPlacePage] = useState(1);
  const limitPerPage = 6; // Fetch trips for regular users (not admin)
  const fetchUserTripsPlaces = async () => {
    if (!allTripPlacesFromAdmin) {
      const res = await axiosInstance(`/Programes/DisplayAllTrips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    }
  };

  const { data: userTripsData } = useQuery<TTripPlace[]>({
    queryKey: ["TripsPlaces"],
    queryFn: fetchUserTripsPlaces,
    placeholderData: keepPreviousData,
    enabled: !allTripPlacesFromAdmin && !isInAdminDashboard,
  });

  // Use admin data if provided, otherwise use user data
  const allTripsPlaces = allTripPlacesFromAdmin || userTripsData || [];

  // pagination logic
  const startForAllTripsPlaces = limitPerPage * (allTripsPlacePage - 1);
  const endForAllTripsPlaces =
    Number(startForAllTripsPlaces) + Number(limitPerPage);
  const paginatedAllTripsPlaces = allTripsPlaces?.slice(
    startForAllTripsPlaces,
    endForAllTripsPlaces
  );
  return (
    <div className="mt-5 container mx-auto ">
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
                    isInAdminDashboard={isInAdminDashboard}
                    handleOpenUpdateTripModal={handleOpenUpdateTripModal}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
          {allTripsPlaces?.length > limitPerPage && (
            <div className="pagination  flex justify-center mt-8">
              <Pagination
                currentPage={allTripsPlacePage}
                totalPages={Math.ceil(allTripsPlaces?.length / limitPerPage)}
                onPageChange={(page: number) => setAllTripsPlacePage(page)}
                showIcons
                key={allTripsPlacePage}
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
  );
}
