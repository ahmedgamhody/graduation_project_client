import { Link, useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { User, MapPin, Phone, Calendar, Globe } from "lucide-react";
import { UserProfileData } from "../../types";
import { renderStars } from "../../utils/functions";

export default function ShowUserProfile() {
  const { userId } = useParams<{ userId: string }>();

  const fetchShowUserProfile = (userId: string) =>
    axiosInstance.get(`/User/PublicProfile?userId=${userId}`).then((res) => {
      const data = res.data;
      console.log(data);
      return data;
    });

  const { data, error, isLoading } = useQuery<UserProfileData>({
    queryKey: ["ShowUserProfile", userId],
    queryFn: () => fetchShowUserProfile(userId!),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">Failed to load user data</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No Data Found
          </h2>
          <p className="text-gray-500">User data not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                {data?.photo !== null ? (
                  <img
                    src={`https://egypt-guid26.runasp.net/images/${data.photo}`}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gray-200 flex items-center justify-center ${
                      data.photo ? "hidden" : ""
                    }`}
                  >
                    {" "}
                    <div className="text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  </div>
                )}
              </div>
            </div>{" "}
            {/* User Information */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {data.name}
              </h1>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{data.country}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dir-ltr">{data.phone}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">
                    {formatDate(data.birthDate)}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <User className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">{data.gender}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">{data.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Tour Guides Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Booked Tour Guide
          </h2>

          {data?.tourguid ? (
            <div className="text-center">
              <Link to={`/show-tour-guide-profile/${data?.tourguid?.id}`}>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                  {/* Guide Photo */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-3 border-blue-200">
                    {data?.tourguid?.photo ? (
                      <img
                        src={`https://egypt-guid26.runasp.net/images/${data?.tourguid?.photo}`}
                        alt={data?.tourguid?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gray-200 flex items-center justify-center ${
                          data?.tourguid?.photo ? "hidden" : ""
                        }`}
                      >
                        {" "}
                        <div className="text-center">
                          <User className="w-8 h-8 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-500 mt-1 block">
                            No Image
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Guide Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {data?.tourguid?.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {renderStars(data?.tourguid?.rate || 0)}
                      <span className="text-sm text-gray-600 mr-2">
                        ({(data?.tourguid?.rate ?? 0).toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Tour Guide Booked
              </h3>
              <p className="text-gray-500">
                No tour guide have been booked yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
