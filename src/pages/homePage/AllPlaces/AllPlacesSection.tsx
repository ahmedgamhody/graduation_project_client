// import CardPlaceSkeleton from "../../../animations/skeletons/CardPlaceSkeleton";
import AllPlacesList from "./AllPlacesList";

export default function AllPlacesSection() {
  return (
    <div className="my-8">
      <h1 className="text-4xl font-bold text-center text-primary">
        All Places
      </h1>
      <div className="border-b-4 border-black mx-auto w-24 mt-2 rounded-lg"></div>
      <AllPlacesList />
    </div>
  );
}
