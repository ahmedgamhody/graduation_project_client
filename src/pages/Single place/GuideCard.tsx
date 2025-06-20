import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { TourGuideCard } from "../../types";
import {
  cancelTourguidReservation,
  setTourguidReservation,
} from "../../utils/api";
import { renderStars } from "../../utils/functions";
import { Button } from "flowbite-react";
import { queryClient } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import { UserRoles } from "../../constants/enums";

export default function GuideCard({ guide }: { guide: TourGuideCard }) {
  const { token, role } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const handleBookGuide = async () => {
    if (!token) {
      nav("/login");
      return;
    }
    try {
      setLoading(true);
      await setTourguidReservation(guide.id, token);
    } catch (error) {
      console.error("Error booking guide:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["tripDetails"] });
      queryClient.invalidateQueries({ queryKey: ["place"] });
      setLoading(false);
    }
  };

  const handleCancelGuide = async () => {
    try {
      setLoading(true);
      await cancelTourguidReservation(token);
    } catch (error) {
      console.error("Error canceling guide:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["tripDetails"] });
      queryClient.invalidateQueries({ queryKey: ["place"] });
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Header with booking status */}
      {guide?.isBooked && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 text-sm font-semibold duration-300 ease-out">
          Currently Booked
        </div>
      )}

      <div className="p-6">
        {/* Guide Photo and Name */}
        <Link to={`/show-tour-guide-profile/${guide.id}`}>
          <div className="text-center mb-4 group cursor-pointer">
            <div className="relative inline-block">
              <img
                src={
                  guide.photo
                    ? `https://egypt-guid26.runasp.net/images/${guide.photo}`
                    : "/avatar.png"
                }
                alt={guide.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-105 transition-transform duration-200 mx-auto"
                onError={(e) => {
                  e.currentTarget.src = "/avatar.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-3 group-hover:text-blue-600 transition-colors duration-200">
              {guide.name}
            </h3>
          </div>
        </Link>

        {/* Guide Rating */}
        {guide?.rate !== undefined && guide.rate >= 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-1">
              {renderStars(guide.rate)}
              <span className="text-gray-700 font-semibold ml-1">
                ({guide.rate.toFixed(1)})
              </span>
            </div>
          </div>
        )}

        {/* Guide Details */}
        <div className="space-y-3 mb-6">
          {guide.gender && (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <User size={16} className="text-blue-500" />
              <span className="text-sm">
                <span className="font-medium">Gender:</span> {guide.gender}
              </span>
            </div>
          )}

          {guide.phone && (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Phone size={16} className="text-green-500" />
              <span className="text-sm">
                <span className="font-medium">Phone:</span> {guide.phone}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {guide?.isBooked ? (
          <Button
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 !important"
            onClick={handleCancelGuide}
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel Tour Guide</span>
              )}
            </div>
          </Button>
        ) : (
          role !== UserRoles.ADMIN &&
          role !== UserRoles.TOUR_GUIDE && (
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 !important"
              onClick={handleBookGuide}
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Book Tour Guide</span>
                )}
              </div>
            </Button>
          )
        )}
      </div>
    </div>
  );
}
