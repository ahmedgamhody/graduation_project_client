import { useParams } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import { TPlaceHome } from "../../types";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/PaginationComponent";
export default function SingleGovernorate() {
  const { name } = useParams();
  useTitle(`Governorates - ${name}`);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 6;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllPlacesGovernorate = (currentPage = 0) =>
    axiosInstance(
      `/Governerate/GovernorateAndPlaces-pagnation?Name=${name}&pageSize=${limitPerPage}&pageNumber=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => {
      const data = res.data;
      setPagesNumber(data.totalPages);
      return data;
    });

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["fetchAllPlacesGovernorate", currentPage],
    queryFn: () => fetchAllPlacesGovernorate(currentPage),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-primary">
        {name} Governorate Places
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isPlaceholderData &&
          Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))}
      </div>
      {!isPlaceholderData && data?.items.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {data?.items.map((place: TPlaceHome, index: number) => (
              <PlaceCard place={place} key={place.id || index} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {data?.totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          pagesNumber={pagesNumber}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
