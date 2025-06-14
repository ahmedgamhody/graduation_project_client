import { Card, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TPlaceDetails, TPlaceHome } from "../../../types";
import Swal from "sweetalert2";
import { useState } from "react";
import { renderStars } from "../../../utils/functions";
import { SquarePen, XCircle } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { useAppSelector } from "../../../store/hooks";
import UpdatePlaceModal from "../../../components/admin/UpdatePlaceModal";
import { deletePlaceByAdmin } from "../../../utils/api";
import { queryClient } from "../../../main";

export default function PlaceCard({
  place,
  isInAdminDashboard,
}: {
  place: TPlaceHome;
  isInAdminDashboard?: boolean;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<TPlaceHome | null>(null);
  const [placeDetails, setPlaceDetails] = useState<TPlaceDetails | null>(null);

  function handleOpenUpdateModal() {
    setShowUpdateModal(true);
    setSelectedPlace(place);
    fetchSinglePlace(place.name);
  }
  function handleCloseUpdateModal() {
    setShowUpdateModal(false);
    setSelectedPlace(null);
    setPlaceDetails(null);
  }
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
          await deletePlaceByAdmin(token, place.name);
          queryClient.invalidateQueries({ queryKey: ["AllPlaces"] });
          Swal.fire({
            title: "Deleted!",
            text: "Your place has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting place:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the place. Please try again.",
            icon: "error",
          });
        }
      }
    });
  }
  async function fetchSinglePlace(placeName: string) {
    try {
      const res = await axiosInstance(
        `/Place/PlacesDetails?name=${placeName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaceDetails(res.data);
      console.log("Fetched Place Details:", res.data);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="max-w-sm">
          <div className="h-48 w-full overflow-hidden bg-gray-200 relative rounded-md">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-300 z-10 "></div>
            )}
            <img
              src={place.photo}
              alt={place.name}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoaded(true)}
            />
          </div>
          <div className="flex  items-center justify-between">
            <h5 className="text-l font-bold tracking-tight text-gray-900 dark:text-white truncate">
              {place.name}
            </h5>
            {place?.googleRate && (
              <div className="flex items-center justify-center gap-1 ">
                {renderStars(place.googleRate || 0)}
                <span className="text-sm text-gray-600 mr-2">
                  ({place?.googleRate?.toFixed(1)})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link to={`/places/${place.name}`} className="w-full">
              <Button className="bg-primary enabled:hover:bg-secondary !important w-full">
                <span className="flex items-center">
                  Read more
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
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleOpenUpdateModal}
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
      {/* Update Modal */}
      {showUpdateModal && selectedPlace && (
        <UpdatePlaceModal
          handleCloseUpdateModal={handleCloseUpdateModal}
          selectedPlace={selectedPlace}
          placeDetails={placeDetails}
        />
      )}
    </>
  );
}
