import { useParams } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { TPlaceHome } from "../../types";
import PlaceCard from "../homePage/AllPlaces/PlaceCard";
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/PaginationComponent";
export default function SingleTourism() {
  const { name } = useParams();
  useTitle(`${name} Tourism`);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const limitPerPage = 6;
  // Pagination logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const fetchAllTypeOfTourism = () =>
    axiosInstance(
      `/TypeOfTourism/TypeOfTourismAndPlaces-pagnation?name=${name}&pageSize=${limitPerPage}&pageNumber=${currentPage}`,
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

  const { data, isPending } = useQuery({
    queryKey: ["Tourism places", currentPage],
    queryFn: () => fetchAllTypeOfTourism(),
    placeholderData: keepPreviousData,
  });
  console.log(data);
  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold text-center text-primary">
        {name} Tourism
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isPending &&
          Array.from({ length: 6 }, (_, index) => (
            <CardPlaceSkeleton key={index} />
          ))}
        {!isPending &&
          data?.items?.length > 0 &&
          data?.items?.map((item: TPlaceHome, index: number) => (
            <PlaceCard place={item} key={index} />
          ))}
      </div>
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
