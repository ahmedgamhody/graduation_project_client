// import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import AllPlacesList from "./AllPlacesList";

export default function AllPlacesSection({
  query,
  isInAdminDashboard,
}: {
  query?: string;
  isInAdminDashboard?: boolean;
}) {
  return (
    <div className="my-8 px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold text-center text-primary">
        {query || "All Places"}
      </h1>
      <div className="border-b-4 border-black mx-auto w-24 mt-2 rounded-lg"></div>
      <AllPlacesList query={query} isInAdminDashboard={isInAdminDashboard} />
    </div>
  );
}
