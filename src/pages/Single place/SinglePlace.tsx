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
            <h1 className="flex items-center gap-1">
              Rating : {data.googleRate}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </h1>
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
