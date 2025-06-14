import { motion } from "framer-motion";
import { Card, Button } from "flowbite-react";
import { TTripPlace } from "../../types";
import { Link } from "react-router-dom";
import { SquarePen, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import { queryClient } from "../../main";
import { deleteTripByAdmin } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
export default function TripPlaceCard({
  tripPlace,
  isInAdminDashboard = false,
  handleOpenUpdateTripModal,
}: {
  tripPlace: TTripPlace;
  isInAdminDashboard?: boolean;
  handleOpenUpdateTripModal?: (tripPlace: TTripPlace) => void;
}) {
  const token = useAppSelector((state) => state.auth.token);
  async function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTripByAdmin(token, tripPlace.name);
          await queryClient.invalidateQueries({
            queryKey: ["TripsPlaces Admin"],
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your trip has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting trip:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the trip. Please try again.",
            icon: "error",
          });
        }
      }
    });
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col"
    >
      <Card className="w-full shadow-xl border border-gray-300 dark:border-gray-700 h-full mx-auto">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          {tripPlace.name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 text-sm line-clamp-4 flex-grow">
          {tripPlace.description}
        </p>

        <div className="mt-4 flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-200">
          <p>
            🗓️ Days: <strong>{tripPlace.days}</strong>
          </p>
          <p>
            📍 Sites: <strong>{tripPlace.number_of_Sites}</strong>
          </p>
          <p>
            💰 Price: <strong>${tripPlace.price.toFixed(2)}</strong>
          </p>
        </div>
        <div>
          <Link
            to={`/recommendation/trips/${tripPlace.name}`}
            className="mt-auto"
          >
            <Button className="bg-primary mt-4 w-full enabled:hover:bg-secondary !important">
              <span className="flex items-center">
                View Details
                <svg
                  className="-mr-1 ml-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Button>
          </Link>
          {isInAdminDashboard && (
            <div className="flex gap-3 w-full mt-4">
              <button
                onClick={() => handleOpenUpdateTripModal?.(tripPlace)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
              >
                <SquarePen className="w-4 h-4" />
                <span className="text-sm">Update</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
