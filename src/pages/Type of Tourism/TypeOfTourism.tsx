import axios from "axios";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { TTourism } from "../../types";
import TourismCard from "./TourismCard";

export default function TypeOfTourism() {
  useTitle("Type of Tourism");
  const token = useAppSelector((state) => state.auth.token);
  const fetchAllTypeOfTourism = () =>
    axios(`https://localhost:7214/api/TypeOfTourism/All-TypeOfTourism`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      return data;
    });

  const { data, isPending } = useQuery({
    queryKey: ["AllTypeOfTourism"],
    queryFn: () => fetchAllTypeOfTourism(),
  });

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-primary">
        Type of Tourism
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isPending
          ? Array.from({ length: 6 }, (_, index) => (
              <CardPlaceSkeleton key={index} />
            ))
          : data?.map((item: TTourism, index: number) => (
              <TourismCard key={item.id || index} tourism={item} />
            ))}
      </div>
    </div>
  );
}
