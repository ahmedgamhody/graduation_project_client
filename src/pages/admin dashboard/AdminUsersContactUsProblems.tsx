import { useEffect, useState } from "react";
import useTitle from "../../hooks/useChangePageTitle";
import { useAppSelector } from "../../store/hooks";
import { ContactUsResponse } from "../../types";
import {
  deleteUserProblem,
  getAllUsersProblems,
  getResolvedUserProblems,
  resolveUserProblem,
} from "../../utils/api";
import ProblemCard from "../../components/admin/ProblemCard";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  CheckCheck,
  CircleCheck,
  SendHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReplyFormData,
  ReplySchema,
} from "../../validation/ContactUsValidation";

export default function AdminUsersContactUsProblems() {
  useTitle("Admin Users Contact Us Problems");
  const { token } = useAppSelector((state) => state.auth);
  const [userProblems, setUserProblems] = useState<ContactUsResponse | null>(
    null
  );
  const [resolvedUserProblems, setResolvedUserProblems] =
    useState<ContactUsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState<number | null>(
    null
  );
  const [problemId, setProblemId] = useState<number | null>(null);
  const [showResolvedModal, setShowResolvedModal] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(ReplySchema),
    mode: "onChange",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problems, resolved] = await Promise.all([
        getAllUsersProblems(token),
        getResolvedUserProblems(token),
      ]);
      setUserProblems(problems);
      setResolvedUserProblems(resolved);
    } catch (error) {
      console.error("Error fetching user problems:", error);
    } finally {
      setLoading(false);
    }
  };
  async function handleDeleteProblem(problemId: number) {
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
          setDeletingProblemId(problemId);
          await deleteUserProblem(token, problemId);

          Swal.fire({
            title: "Deleted!",
            text: "Problem has been deleted successfully.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting problem:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the problem. Please try again.",
            icon: "error",
          });
        } finally {
          setDeletingProblemId(null);
          fetchData();
        }
      }
    });
  }
  function handleShowResolvedModal(problemId: number) {
    setShowResolvedModal(true);
    setProblemId(problemId);
    reset(); // Reset form when opening modal
  }

  function handleCloseResolvedModal() {
    setShowResolvedModal(false);
    setProblemId(null);
    reset(); // Reset form when closing modal
  }

  async function handleResolveProblem(data: ReplyFormData) {
    if (!problemId) {
      return;
    }
    try {
      setIsResolving(true);
      await resolveUserProblem(token, problemId, data.replyMessage);
      handleCloseResolvedModal();
      fetchData();
    } catch (error) {
      console.error("Error resolving problem:", error);
    } finally {
      setIsResolving(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  console.log("userProblems", userProblems);
  console.log("resolvedUserProblems", resolvedUserProblems);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Us Problems Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and track user problems and feedback
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pending Problems Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pending Problems
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {userProblems?.count || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Problems awaiting resolution
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TriangleAlert className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Resolved Problems Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resolved Problems
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {resolvedUserProblems?.count || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Successfully resolved problems
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CircleCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Problems Lists */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Pending Problems List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                Pending Problems ({userProblems?.count || 0})
              </h2>
            </div>
            <div className="p-6">
              {userProblems?.problems && userProblems.problems.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {" "}
                  {userProblems.problems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      handleDeleteProblem={handleDeleteProblem}
                      isDeleting={deletingProblemId === problem.id}
                      handleShowResolvedModal={handleShowResolvedModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CircleCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending problems</p>
                </div>
              )}
            </div>
          </div>

          {/* Resolved Problems List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Resolved Problems ({resolvedUserProblems?.count || 0})
              </h2>
            </div>
            <div className="p-6">
              {resolvedUserProblems?.problems &&
              resolvedUserProblems.problems.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {" "}
                  {resolvedUserProblems.problems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      handleDeleteProblem={handleDeleteProblem}
                      isDeleting={deletingProblemId === problem.id}
                      handleShowResolvedModal={handleShowResolvedModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CircleCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No resolved problems yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Resolved Problem Modal */}
      {showResolvedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Resolve Problem
                  </h3>
                </div>
              </div>
            </div>{" "}
            {/* Modal Content */}
            <form
              id="resolve-form"
              onSubmit={handleSubmit(handleResolveProblem)}
              className="p-6 max-h-96 overflow-y-auto"
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("replyMessage")}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your reply to resolve this problem..."
                  disabled={isResolving}
                />
                {errors.replyMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.replyMessage.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      What happens when you resolve this problem?
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The user will receive your reply message and the problem
                      will be marked as resolved. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </form>{" "}
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseResolvedModal}
                disabled={isResolving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="resolve-form"
                onClick={handleSubmit(handleResolveProblem)}
                disabled={isResolving || !isValid}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResolving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resolving...
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-4 h-4" />
                    Resolve Problem
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
