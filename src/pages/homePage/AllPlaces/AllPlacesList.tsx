import { TPlaceHome } from "../../../types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "./PlaceCard";
import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import { useAppSelector } from "../../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import PaginationComponent from "../../../components/PaginationComponent";

export default function AllPlacesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 9;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);

  const fetchAllPlaces = (currentPage = 0) =>
    axiosInstance(
      `/Place/DisplayAllPlacesByPagnation?pageNumber=${currentPage}&pageSize=${limitPerPage}`,
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
    queryKey: ["AllPlaces", currentPage],
    queryFn: () => fetchAllPlaces(currentPage),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="container mx-auto mt-10 flex flex-col items-center justify-center">
      {isPlaceholderData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
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
          {pagesNumber > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              pagesNumber={pagesNumber}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
