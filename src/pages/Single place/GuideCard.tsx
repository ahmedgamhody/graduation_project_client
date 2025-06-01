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
import { Link } from "react-router-dom";

export default function GuideCard({ guide }: { guide: TourGuideCard }) {
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const handleBookGuide = async () => {
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
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Guide Photo */}
      <Link to={`/show-tour-guide-profile/${guide.id}`}>
        <div className="flex flex-col items-center mb-4 hover:underline hover:text-blue-600 transition duration-300">
          <img
            src={
              guide.photo
                ? `https://egypt-guid26.runasp.net/images/${guide.photo}`
                : "/avatar.png"
            }
            alt={guide.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
            onError={(e) => {
              e.currentTarget.src = "/avatar.png";
            }}
          />
          <h3 className="text-lg font-semibold text-gray-900 mt-2 text-center">
            {guide.name}
          </h3>
        </div>
      </Link>
      {/* Guide Info */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {guide?.rate !== undefined && guide.rate >= 0 && (
          <div className="flex items-center justify-center gap-1">
            {renderStars(guide.rate)}
            <span className="text-gray-600">({guide.rate.toFixed(1)})</span>
          </div>
        )}

        {guide.gender && (
          <p className="text-center">
            <span className="font-medium">Gender:</span> {guide.gender}
          </p>
        )}
        {guide.phone && (
          <p className="text-center">
            <span className="font-medium">Phone:</span> {guide.phone}
          </p>
        )}
      </div>

      {/* Book Button */}
      {guide?.isBooked ? (
        <Button
          className="w-full bg-red-500 enabled:hover:bg-red-600 !important"
          onClick={handleCancelGuide}
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="loader"></span>
                <span> Cancelling...</span>
              </>
            ) : (
              <span>Cancel Tour Guide</span>
            )}
          </div>
        </Button>
      ) : (
        <Button
          className="w-full bg-primary enabled:hover:bg-secondary !important"
          onClick={handleBookGuide}
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="loader"></span>
                <span>Booking...</span>
              </>
            ) : (
              <span>Book Tour Guide</span>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}
