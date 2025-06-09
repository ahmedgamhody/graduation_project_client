import { useState } from "react";
import useTitle from "../../hooks/useChangePageTitle";
import AllPlacesSection from "../homePage/AllPlaces/AllPlacesSection";
import { CirclePlus, Search } from "lucide-react";
import AddPlaceModal from "../../components/admin/AddPlaceModal";

export default function AdminPlaces() {
  useTitle("Admin Places");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  function handleCloseAddPlaceModal() {
    setShowAddPlaceModal(false);
  }
  function handleOpenAddPlaceModal() {
    setShowAddPlaceModal(true);
  }
  return (
    <div className=" bg-gray-50 p-6 max-h-screen">
      <div className="mt-8 w-full max-w-xl mx-auto ">
        <form className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for places, find it here..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>
      </div>
      <div className="max-w-7xl mx-auto mt-6 mb-4 flex gap-2">
        <button
          onClick={handleOpenAddPlaceModal}
          className=" flex items-center justify-center gap-2 bg-black hover:bg-gray-700 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
        >
          <CirclePlus className="w-4 h-4" />
          <span className="text-sm">Add New Place</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <AllPlacesSection isInAdminDashboard={true} query={searchQuery} />
      </div>
      <div className="text-white text-xs">cs</div>
      {showAddPlaceModal && (
        <AddPlaceModal handleCloseAddPlaceModal={handleCloseAddPlaceModal} />
      )}
    </div>
  );
}
