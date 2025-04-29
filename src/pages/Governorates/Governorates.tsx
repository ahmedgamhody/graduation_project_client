import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { TGovernorate } from "../../types";
import GovernorateCard from "./GovernorateCard";
import { useState } from "react";
import { Pagination } from "flowbite-react";
import { keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
export default function Governorates() {
  useTitle("Governorates");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 6;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllGovernorates = (currentPage = 0) =>
    axiosInstance(
      `/Governerate/All-Governorate-Pagnation?pageNumber=${currentPage}&pageSize=${limitPerPage}`,
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
    queryKey: ["Governorates", currentPage],
    queryFn: () => fetchAllGovernorates(currentPage),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-primary">
        Governorates
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isPlaceholderData ? (
          Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))
        ) : (
          <>
            {data?.items?.map((item: TGovernorate, index: number) => (
              <GovernorateCard key={item.name || index} governorate={item} />
            ))}
          </>
        )}
      </div>
      <div className="pagination  flex overflow-x-auto sm:justify-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={pagesNumber}
          onPageChange={onPageChange}
          showIcons
        />
      </div>
    </div>
  );
}
