import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useTitle from "../../hooks/useChangePageTitle";
import { getDashboardCharts } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  UserCheck,
  Globe2,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";
import { DashboardData } from "../../types";
import { renderStars } from "./../../utils/functions";

export default function AdminDashboard() {
  useTitle("Admin Dashboard");
  const { token } = useAppSelector((state) => state.auth);

  const { data, isPending, error } = useQuery<DashboardData>({
    queryKey: ["adminDashboardCharts", token],
    queryFn: () => getDashboardCharts(token),
    placeholderData: keepPreviousData,
  });

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Failed to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const totalUsers = data.countMale + data.countFamle;
  const genderData = [
    { name: "Male", value: data.countMale, color: "#0088FE" },
    { name: "Female", value: data.countFamle, color: "#FF8042" },
  ];
  console.log(data);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your platform's performance and user analytics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tour Guides</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.allTourguidsByScope.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Globe2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Countries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.peopleForCountries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Top Places</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.topFavoritePlaces.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Countries Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe2 className="w-5 h-5 mr-2 text-blue-600" />
              Users by Country
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.peopleForCountries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="country"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tour Guides Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Top Tour Guides Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.allTourguidsByScope.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Guide: ${label}`}
                formatter={(value) => [`${value}`, "Tours Completed"]}
              />
              <Legend />
              <Bar
                dataKey="countOfTourisms"
                fill="#00C49F"
                name="Tours Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Favorite Places */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Top Favorite Places
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.topFavoritePlaces.map((place, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <img
                  src={place.photo}
                  alt={place.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/64/64";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{place.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center space-x-1">
                      {renderStars(place.googleRate)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {place.googleRate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
