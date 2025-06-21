import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAppSelector } from "../../store/hooks";
import { GuideData, TourGuideProfileData } from "../../types";
import useTitle from "../../hooks/useChangePageTitle";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Languages,
  CarTaxiFront,
  FileText,
  Edit3,
  Save,
  Users,
} from "lucide-react";
import { renderStars } from "../../utils/functions";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { queryClient } from "../../main";
import {
  cancelTourguidReservation,
  setTourguidReservation,
  rateTourGuide,
  handleActiveTourGuide,
  getTourGuideProfileData,
  updateMaxTouristsForTourGuide,
} from "../../utils/api";
import StarRating from "../../components/StarRating";
import { toast } from "react-hot-toast";
import { UserRoles } from "../../constants/enums";
import avatar from "../../../public/avatar.png";

export default function ShowTourGuideProfile() {
  const { tourGuideId } = useParams<{ tourGuideId: string }>();
  const { token, role, id } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [tourGuideData, setTourGuideData] =
    useState<TourGuideProfileData | null>(null);
  const [isEditingMaxTourists, setIsEditingMaxTourists] = useState(false);
  const [maxTouristsValue, setMaxTouristsValue] = useState<string>("");
  const [isUpdatingMaxTourists, setIsUpdatingMaxTourists] = useState(false);
  // Set page title
  useTitle("Tour Guide Profile");
  const fetchShowTourGuideProfile = (tourGuideId: string) =>
    axiosInstance
      .get(`/Tourguid/PublicProfile?id=${tourGuideId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        return data;
      });

  const { data, error, isLoading } = useQuery<GuideData>({
    queryKey: ["ShowTourGuideProfile", tourGuideId],
    queryFn: () => fetchShowTourGuideProfile(tourGuideId!),
    enabled: !!tourGuideId,
    placeholderData: keepPreviousData,
  });

  const handleCancelGuide = async () => {
    try {
      setLoading(true);
      await cancelTourguidReservation(token);
    } catch (error) {
      console.error("Error canceling guide:", error);
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["ShowTourGuideProfile"],
      });
      setLoading(false);
    }
  };
  const handleBookGuide = async (tourguidId: string) => {
    try {
      setLoading(true);
      await setTourguidReservation(tourguidId, token);
    } catch (error) {
      console.error("Error booking guide:", error);
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["ShowTourGuideProfile"],
      });
      setLoading(false);
    }
  };
  const handleRating = async (rating: number) => {
    if (ratingLoading) return;
    if (!token) {
      toast.error("Please login to rate tour guides");
      return;
    }

    try {
      setRatingLoading(true);
      await rateTourGuide(token, tourGuideId!, rating);
    } catch (error) {
      console.error("Error rating tour guide:", error);
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["ShowTourGuideProfile"],
      });
      setRatingLoading(false);
    }
  };
  const handleToggleActive = async () => {
    if (!data) return;

    setIsToggleLoading(true);
    try {
      await handleActiveTourGuide(token, !data.isActive);
      await queryClient.invalidateQueries({
        queryKey: ["ShowTourGuideProfile"],
      });
    } catch (error) {
      console.error("Failed to toggle active status:", error);
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handleEditMaxTourists = () => {
    setIsEditingMaxTourists(true);
    setMaxTouristsValue(tourGuideData?.maxTourists?.toString() || "");
  };

  const handleSaveMaxTourists = async () => {
    if (!maxTouristsValue || isNaN(Number(maxTouristsValue))) {
      toast.error("Please enter a valid number");
      return;
    }

    setIsUpdatingMaxTourists(true);
    try {
      await updateMaxTouristsForTourGuide(token, Number(maxTouristsValue));

      // Update local state
      if (tourGuideData) {
        setTourGuideData({
          ...tourGuideData,
          maxTourists: Number(maxTouristsValue),
        });
      }

      setIsEditingMaxTourists(false);
    } catch (error) {
      console.error("Failed to update max tourists:", error);
    } finally {
      setIsUpdatingMaxTourists(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMaxTourists(false);
    setMaxTouristsValue("");
  };

  const handleViewCV = () => {
    if (tourGuideData?.cv) {
      const cvUrl = `https://docs.google.com/gview?url=https://egypt-guid26.runasp.net/files/${tourGuideData.cv}&embedded=true`;
      window.open(cvUrl, "_blank");
    }
  };
  useEffect(() => {
    if (role === UserRoles.TOUR_GUIDE) {
      const tourGuideData = async () => {
        const res = await getTourGuideProfileData(token);
        if (res) {
          setTourGuideData(res);
          // Set initial value for maxTourists
          setMaxTouristsValue(res.maxTourists?.toString() || "");
        } else {
          console.error("Failed to fetch tour guide data");
        }
      };
      tourGuideData();
    }
  }, [token, role]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">
            Failed to load tour guide profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            The requested tour guide profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {" "}
              {/* Profile Photo */}
              <div className="relative">
                <img
                  src={
                    data.photo === null
                      ? avatar
                      : `https://egypt-guid26.runasp.net/images/${data.photo}`
                  }
                  alt={data.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/150/150";
                  }}
                />
                {/* Active Status Indicator */}
                <div className="absolute bottom-2 right-2">
                  {data.isActive ? (
                    <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 bg-white rounded-full" />
                  )}
                </div>
              </div>{" "}
              {/* Basic Info */}
              <div className="text-center md:text-left text-white flex-1">
                <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                  {renderStars(data.rate || 0)}
                  <span className="ml-2 text-white/90">
                    ({data.rate ? data.rate.toFixed(1) : "0.0"})
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      data.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {data.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
              {/* Activity Toggle - Only visible to the owner */}
              {role === UserRoles.TOUR_GUIDE && id === tourGuideId && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg">Activity Status</h3>
                      <p className="text-sm text-white/80">
                        {data.isActive
                          ? "You are available for bookings"
                          : "You are unavailable for bookings"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {data.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.isActive}
                          onChange={handleToggleActive}
                          disabled={isToggleLoading}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                      </label>
                      {isToggleLoading && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">
                      {data.email || "Not provided"}
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">
                      {data.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-800">
                      {data.country || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-800 capitalize">
                      {data.gender || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="text-gray-800">
                      {data.birthDate
                        ? new Date(data.birthDate).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>{" "}
                {role === UserRoles.MEMBER && (
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>{" "}
                    <div className="flex flex-col space-y-1">
                      <StarRating
                        maxRating={5}
                        size="18px"
                        defaultRating={data.rate || 0}
                        onSetRating={handleRating}
                        disabled={ratingLoading || !token}
                        messages={[
                          "Bad",
                          "Average",
                          "Good",
                          "Very Good",
                          "Excellent",
                        ]}
                      />
                      {ratingLoading && (
                        <p className="text-xs text-blue-600">
                          Submitting rating...
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Languages className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="text-gray-800">
                      {data?.allLangues && data.allLangues?.length > 0
                        ? data.allLangues.join(", ")
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
          {role === UserRoles.MEMBER &&
            (!data.isBooked ? (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Book This Tour Guide
                </h3>
                <Button
                  className="w-full bg-primary enabled:hover:bg-secondary !important"
                  onClick={() => handleBookGuide(tourGuideId!)}
                  disabled={loading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="loader"></span>
                        <span> Booking...</span>
                      </>
                    ) : (
                      <span>Book Tour Guide</span>
                    )}
                  </div>
                </Button>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Cancel Your Booking
                </h3>
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
                      <span>Cancel Booking</span>
                    )}
                  </div>
                </Button>
              </div>
            ))}{" "}
          {/* Additional Information Section */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score (Number of Trips) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Trips</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {data.score || 0}
                    </p>
                  </div>
                </div>
              </div>
              {/* Places or Trip Name */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  {data.tripName && (
                    <>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {data.tripName ? "Current Trip" : "Available Places"}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {data.tripName ||
                            (data.place
                              ? JSON.stringify(data.place)
                              : "No current assignment")}
                        </p>
                      </div>
                    </>
                  )}
                  {data?.place && (
                    <>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CarTaxiFront className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Available Places
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {(data.place && 1) || 0}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>{" "}
              {/* Current Tourists Count */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Tourists</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {data.touristsCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* CV and Max Tourists Section - Only for Tour Guide */}
            {role === UserRoles.TOUR_GUIDE && tourGuideData && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Tour Guide Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CV Section */}
                  {tourGuideData.cv && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CV Document</p>
                          <p className="text-gray-800 font-medium">Available</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleViewCV}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white !important"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View CV
                      </Button>
                    </div>
                  )}

                  {/* Max Tourists Section */}
                  {id === tourGuideId && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Max Tourists
                            </p>
                            <p className="text-gray-800 font-medium">
                              {tourGuideData.maxTourists === null
                                ? "No Limit"
                                : `${tourGuideData.maxTourists} tourists`}
                            </p>
                          </div>
                        </div>
                        {!isEditingMaxTourists && (
                          <Button
                            onClick={handleEditMaxTourists}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white !important"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {isEditingMaxTourists && (
                        <div className="space-y-3">
                          <input
                            type="number"
                            value={maxTouristsValue}
                            onChange={(e) =>
                              setMaxTouristsValue(e.target.value)
                            }
                            placeholder="Enter max tourists (leave empty for no limit)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            disabled={isUpdatingMaxTourists}
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleSaveMaxTourists}
                              disabled={isUpdatingMaxTourists}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white !important"
                            >
                              {isUpdatingMaxTourists ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </div>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              disabled={isUpdatingMaxTourists}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white !important"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}{" "}
            {data.place && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Available Place for Current Trip
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <Link
                    to={`/places/${data.place.name}`}
                    className="flex items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            data.place.photo
                              ? `${data.place.photo}`
                              : "/api/placeholder/80/80"
                          }
                          alt={data.place.name || "Place"}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/80/80";
                          }}
                        />
                      </div>

                      {/* Place Details */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <h5 className="text-lg font-semibold text-gray-900 truncate">
                            {data.place.name || "Unknown Place"}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
            {/* Current Tourists List */}
            {data.tourists && data.tourists.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Current Trip Participants
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.tourists.map((tourist, index) => (
                    <div
                      key={tourist.id || index}
                      className=" space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <img
                          src={
                            tourist.photo === null
                              ? avatar
                              : `https://egypt-guid26.runasp.net/images/${tourist.photo}`
                          }
                          alt={tourist.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/40/40";
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {tourist.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {tourist.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* No Tourists Message */}
            {(!data.tourists || data.tourists.length === 0) &&
              data.isActive && (
                <div className="mt-6 text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No tourists currently assigned to this guide
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
