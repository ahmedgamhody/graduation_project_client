import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useTitle from "../../hooks/useChangePageTitle";
import { TPlaceDetails } from "../../types";
import { LocateFixed } from "lucide-react";
import { Badge, Button } from "flowbite-react";
import SinglePlaceSkeleton from "../../animations/skeletons/SinglePlaceSkeleton";
import axiosInstance from "../../api/axiosInstance";
import SinglePlaceComments from "./SinglePlaceComments";
import { renderStars } from "../../utils/functions";

export default function SinglePlace() {
  const { name } = useParams();

  useTitle(`Place - ${name}`);
  const token = useAppSelector((state) => state.auth.token);
  const fetchSinglePlace = () =>
    axiosInstance(`/Place/PlacesDetails?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      return data;
    });

  const { data, isPending } = useQuery<TPlaceDetails>({
    queryKey: ["place"],
    queryFn: () => fetchSinglePlace(),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="container mx-auto my-5">
      {isPending && <SinglePlaceSkeleton />}
      {data && (
        <div className="flex flex-col  gap-5">
          <div className="flex justify-center rounded-lg">
            <img
              src={data?.photo}
              alt={data?.name}
              className="rounded-lg max-w-full h-auto"
            />
          </div>
          <div className="flex justify-between">
            <h1 className="flex items-center gap-1 text-green-600">
              <LocateFixed color="green" size={20} />
              {data.governmentName}
            </h1>
            <div className="flex items-center justify-center gap-1 ">
              {renderStars(data.googleRate || 0)}
              <span className="text-sm text-gray-600 mr-2">
                ({data?.googleRate?.toFixed(1)})
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-primary">{data.name}</h1>
            <p className="text-md text-gray-600">{data.description}</p>
            <div>
              <h1 className="text-lg font-bold text-secondary">
                Type of Tourism
              </h1>
              <div className="flex gap-3 mt-3">
                {data?.typeOfTourism.map((item, index) => (
                  <Badge key={index} color="info" className="text-md p-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-md text-primary"> {data.visitingHours}</p>
              <Link to={`${data.location}`} target="_blank">
                <Button className="bg-secondary enabled:hover:bg-primary !important">
                  Show location
                </Button>
              </Link>
            </div>
          </div>{" "}
          <SinglePlaceComments data={data} />
        </div>
      )}
    </div>
  );
}
