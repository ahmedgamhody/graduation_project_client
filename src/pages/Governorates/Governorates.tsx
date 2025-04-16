import useTitle from "../../hooks/useChangePageTitle";
import axios from "axios";
import { useAppSelector } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { TGovernorate } from "../../types";
import GovernorateCard from "./GovernorateCard";
export default function Governorates() {
  useTitle("Governorates");
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
        Governorates
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isPending
          ? Array.from({ length: 6 }, (_, index) => (
              <CardPlaceSkeleton key={index} />
            ))
          : data?.map((item: TGovernorate, index: number) => (
              <GovernorateCard key={item.name || index} governorate={item} />
            ))}
      </div>
    </div>
  );
}
