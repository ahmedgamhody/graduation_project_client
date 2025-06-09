import { TPlaceHome } from "../../../types";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "./PlaceCard";
import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import { useAppSelector } from "../../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import PaginationComponent from "../../../components/PaginationComponent";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllPlacesList({
  query,
  isInAdminDashboard,
}: {
  query?: string;
  isInAdminDashboard?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const nav = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 9;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllPlaces = (currentPage = 0, query?: string) => {
    const url = `/Place/DisplayAllPlacesByPagnation?pageNumber=${currentPage}&pageSize=${limitPerPage}${
      query && query.trim()
        ? `&searchValue=${encodeURIComponent(query.trim())}`
        : ""
    }`;
    return axiosInstance(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      setPagesNumber(data.totalPages);
      return data;
    });
  };

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["AllPlaces", currentPage, query],
    queryFn: () => fetchAllPlaces(currentPage, query),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

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
                <PlaceCard
                  place={place}
                  key={place.id || index}
                  isInAdminDashboard={isInAdminDashboard}
                />
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
      {data?.items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 ">
          <p className="text-2xl font-bold text-gray-800 mt-10">
            No Places Found for "{query}"
          </p>
          <button
            onClick={() => nav("/")}
            className="bg-secondary hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg font-medium flex items-center gap-2"
          >
            <ArrowBigLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
