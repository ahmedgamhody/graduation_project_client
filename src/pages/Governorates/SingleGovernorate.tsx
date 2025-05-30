import { useParams } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import { TPlaceHome } from "../../types";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/PaginationComponent";
import { Search } from "lucide-react";
export default function SingleGovernorate() {
  const { name } = useParams();
  useTitle(`Governorates - ${name}`);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 6;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllPlacesGovernorate = (currentPage = 0, searchQuery = "") =>
    axiosInstance(
      `/Governerate/GovernorateAndPlaces-pagnation?Name=${name}&pageSize=${limitPerPage}&pageNumber=${currentPage}${
        searchQuery.trim()
          ? `&searchValue=${encodeURIComponent(searchQuery.trim())}`
          : ""
      }`,
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
    queryKey: ["fetchAllPlacesGovernorate", currentPage, searchQuery],
    queryFn: () => fetchAllPlacesGovernorate(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [name, searchQuery]);
  return (
    <div className="container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-primary">
        {name} Governorate Places
      </h1>
      <div className="mt-8 w-full max-w-xl mx-auto">
        <form className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for places, find it here..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>
      </div>
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

      {data?.items.length > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          pagesNumber={pagesNumber}
          onPageChange={onPageChange}
        />
      )}
      {data?.items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
          <h1 className="text-2xl font-bold text-center text-primary">
            No Places Found
          </h1>
          <p className="text-gray-600 text-lg">
            Try searching for a different term or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
