import { TPlaceHome } from "../../../types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceCard from "./PlaceCard";
import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import { useAppSelector } from "../../../store/hooks";

export default function AllPlacesList() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const limitPerPage = 9;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await axios(
          `https://localhost:7214/api/Place/DisplayAllPlacesByPagnation?pageNumber=${currentPage}&pageSize=${limitPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setPlaces(data.items);
        setPagesNumber(data.totalPages);
        console.log("Places data:", data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching places:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [token, currentPage]);

  return (
    <div className="container mx-auto mt-10 flex flex-col items-center justify-center">
      {loading ? (
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
              {places?.map((place: TPlaceHome, index) => (
                <PlaceCard place={place} key={place.id || index} />
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="pagination  flex overflow-x-auto sm:justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={pagesNumber}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        </>
      )}
    </div>
  );
}
