import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import TripPlacesSection from "../Recommendation/TripPlacesSection";
import { TTripDetails, TTripPlace } from "../../types";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import AddTripPlaceModal from "../../components/admin/AddTripPlaceModal";
import UpdateTripModal from "../../components/admin/UpdateTripModal";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";

export default function AdminTripPlaces() {
  useTitle("Admin Trip Places ");
  const { token } = useAppSelector((state) => state.auth);
  const [showAddTripPlaceModal, setShowAddTripPlaceModal] = useState(false);
  const [showUpdateTripModal, setShowUpdateTripModal] = useState(false);
  const [tripDetails, setTripDetails] = useState<TTripDetails | null>(null);
  const fetchAllTripsPlaces = () =>
    axiosInstance(`/Tourguid/DisplayAllTrips`).then((res) => {
      const data = res.data.trips;
      return data;
    });

  const { data } = useQuery<TTripPlace[]>({
    queryKey: ["TripsPlaces Admin"],
    queryFn: () => fetchAllTripsPlaces(),
    placeholderData: keepPreviousData,
  });
  function handleCloseAddTripPlaceModal() {
    setShowAddTripPlaceModal(false);
  }
  function handleOpenAddTripPlaceModal() {
    setShowAddTripPlaceModal(true);
  }
  function handleOpenUpdateTripModal(tripPlace: TTripPlace) {
    setShowUpdateTripModal(true);
    fetchTripDetails(tripPlace.name);
  }
  function handleCloseUpdateTripModal() {
    setShowUpdateTripModal(false);
    setTripDetails(null);
  }
  async function fetchTripDetails(tripName: string) {
    console.log("Fetching trip details for:", tripName);
    try {
      const res = await axiosInstance(
        `/Programes/Trip-Details?TripName=${tripName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTripDetails(res.data);
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  }
  return (
    <div className="max-h-screen p-6 ">
      <div className="max-w-7xl mx-auto mt-6 mb-4 flex gap-2">
        <button
          onClick={handleOpenAddTripPlaceModal}
          className=" flex items-center justify-center gap-2 bg-black hover:bg-gray-700 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
        >
          <CirclePlus className="w-4 h-4" />
          <span className="text-sm">Add New Trip </span>
        </button>
      </div>
      <TripPlacesSection
        allTripPlacesFromAdmin={data}
        isInAdminDashboard
        handleOpenUpdateTripModal={handleOpenUpdateTripModal}
      />
      {showAddTripPlaceModal && (
        <AddTripPlaceModal
          handleCloseAddTripPlaceModal={handleCloseAddTripPlaceModal}
        />
      )}
      {showUpdateTripModal && tripDetails && (
        <UpdateTripModal
          handleCloseUpdateTripModal={handleCloseUpdateTripModal}
          tripDetails={tripDetails}
        />
      )}
      <span className="text-white">ss</span>
    </div>
  );
}
