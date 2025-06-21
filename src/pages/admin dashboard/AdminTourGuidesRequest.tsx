import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { TNotActiveTourGuide, TNotActiveTourGuidesData } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Eye,
  Download,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Clock,
} from "lucide-react";
import CardPlaceSkeleton from "../../animations/skeletons/CardPlaceSkeleton";
import { queryClient } from "../../main";
import { deleteTourguid, setTourguidActive } from "../../utils/api";
import { Link } from "react-router-dom";

export default function AdminTourGuidesRequest() {
  useTitle("Admin Tour Guides Request");
  const { token } = useAppSelector((state) => state.auth);
  const [selectedGuide, setSelectedGuide] =
    useState<TNotActiveTourGuide | null>(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchAllNotActiveTourGuides = () => {
    const url = `/Admin/NotActiveTourguid`;
    return axiosInstance(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const data = res.data;
      console.log("Fetched Not Active Tour Guides:", data);
      return data;
    });
  };

  const { data, isPending } = useQuery<TNotActiveTourGuidesData>({
    queryKey: ["AllNotActiveTourGuides"],
    queryFn: () => fetchAllNotActiveTourGuides(),
    placeholderData: keepPreviousData,
  });

  const handleViewCV = (guide: TNotActiveTourGuide) => {
    setSelectedGuide(guide);
    setShowCVModal(true);
  };
  const handleCloseCVModal = () => {
    setSelectedGuide(null);
    setShowCVModal(false);
  };
  const handleApprove = async (guideId: string) => {
    try {
      setIsLoading(true);
      await setTourguidActive(guideId, token);
    } catch (error) {
      console.log("Error approving guide:", error);
    } finally {
      setShowCVModal(false);
      setSelectedGuide(null);
      queryClient.invalidateQueries({ queryKey: ["AllNotActiveTourGuides"] });
      setIsLoading(false);
    }
  };

  const handleReject = async (guideId: string) => {
    try {
      setIsLoading(true);
      await deleteTourguid(guideId, token);
    } catch (error) {
      console.error("Error rejecting guide:", error);
    } finally {
      setShowCVModal(false);
      setSelectedGuide(null);
      queryClient.invalidateQueries({ queryKey: ["AllNotActiveTourGuides"] });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-white/70 flex items-center justify-center pointer-events-auto cursor-wait">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-h-screen bg-gradient-to-br  to-indigo-100 p-6 ">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tour Guide Requests
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage tour guide applications
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pending Applications
                    </h3>
                    <p className="text-gray-600">
                      {data?.count || 0} tour guides awaiting approval
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {data?.count || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Tour Guides Grid */}
          {isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <CardPlaceSkeleton key={index} />
              ))}
            </div>
          ) : !data?.notActiveTourguids?.length ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Pending Requests
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are currently no tour guide applications waiting for
                review.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {data.notActiveTourguids.map((guide: TNotActiveTourGuide) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Guide Photo */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                      <img
                        src={`https://egypt-guid26.runasp.net/images/${guide.photo}`}
                        alt={guide.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/avatar.png";
                        }}
                      />
                      {}
                    </div>

                    {/* Guide Info */}
                    <div className="p-4">
                      <Link to={`/show-tour-guide-profile/${guide.id}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mt-3 hover:text-blue-600 transition-colors duration-200">
                              {guide.name}
                            </h3>
                          </div>
                        </div>
                      </Link>
                      {/* CV Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            CV Document
                          </span>
                        </div>
                        <button
                          onClick={() => handleViewCV(guide)}
                          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View CV</span>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(guide.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(guide.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 px-4 transition-colors duration-200 font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Reject</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* CV Modal */}
          {showCVModal && selectedGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedGuide.name}'s CV
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://egypt-guid26.runasp.net/api/Tourguid/DownloadFiles?userid=${selectedGuide.id}`}
                      download
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </a>
                    <button
                      onClick={() => handleCloseCVModal()}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <iframe
                    src={`https://docs.google.com/gview?url=https://egypt-guid26.runasp.net/files/${selectedGuide.cv}&embedded=true`}
                    className="w-full h-96 border border-gray-200 rounded-lg"
                    title={`${selectedGuide.name}'s CV`}
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => handleCloseCVModal()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedGuide.id);
                      setShowCVModal(false);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedGuide.id);
                      setShowCVModal(false);
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
