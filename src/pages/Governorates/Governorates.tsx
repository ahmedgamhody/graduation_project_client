import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { TGovernorate } from "../../types";
import GovernorateCard from "./GovernorateCard";
import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/PaginationComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function Governorates() {
  useTitle("Governorates");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 6;

  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllGovernorates = (currentPage = 0, searchQuery = "") =>
    axiosInstance(
      `/Governerate/All-Governorate-Pagnation?pageNumber=${currentPage}&pageSize=${limitPerPage}${
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
    queryKey: ["Governorates", currentPage, searchQuery],
    queryFn: () => fetchAllGovernorates(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  return (
    <div className="container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-primary">
        Governorates
      </h1>

      <div className="mt-8 w-full max-w-xl mx-auto">
        <form className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Governorates, find it here..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>
      </div>

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
              {data?.items?.map((item: TGovernorate, index: number) => (
                <GovernorateCard key={item.name || index} governorate={item} />
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
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
          <h1 className="text-2xl font-bold text-center text-primary">
            No Governorates Found
          </h1>
          <p className="text-gray-600 text-lg">
            Try searching for a different term or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
