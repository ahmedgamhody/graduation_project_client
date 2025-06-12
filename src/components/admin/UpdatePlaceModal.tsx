import { motion } from "framer-motion";
import { SquarePen, XCircle } from "lucide-react";
import { TPlaceDetails, TPlaceHome } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePlaceFormData,
  UpdatePlaceSchema,
} from "../../validation/AdminPlaceValidation";
import { visitingHoursOptions } from "../../pages/admin dashboard";
import { useEffect } from "react";
import { updatePlaceByAdmin } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
import { queryClient } from "../../main";

export default function UpdatePlaceModal({
  selectedPlace,
  handleCloseUpdateModal,
  placeDetails,
}: {
  selectedPlace: TPlaceHome;
  placeDetails: TPlaceDetails | null;
  handleCloseUpdateModal: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm<UpdatePlaceFormData>({
    resolver: zodResolver(UpdatePlaceSchema),
    mode: "onChange",
    defaultValues: {
      photo: "",
      description: "",
      visitingHours: visitingHoursOptions[0],
      googleRate: 0,
    },
  });
  useEffect(() => {
    if (placeDetails) {
      const isValidVisitingHours = visitingHoursOptions.includes(
        placeDetails.visitingHours as (typeof visitingHoursOptions)[number]
      );
      reset({
        photo: placeDetails.photo || "",
        description: placeDetails.description || "",
        visitingHours: isValidVisitingHours
          ? (placeDetails.visitingHours as (typeof visitingHoursOptions)[number])
          : visitingHoursOptions[0],
        googleRate: placeDetails.googleRate || 0,
      });
    }
  }, [placeDetails, reset]);

  const onSubmit = async (data: UpdatePlaceFormData) => {
    try {
      await updatePlaceByAdmin(token, data, selectedPlace.name);
    } catch (error) {
      console.error("Error updating place:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["AllPlaces"] });
      handleCloseUpdateModal();
    }
  };

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Updating place...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SquarePen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Update Place: {selectedPlace.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCloseUpdateModal()}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>{" "}
        {/* Modal Content */}
        <form
          id="update-place-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Loading State */}
            {!placeDetails && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading place details...</p>
              </div>
            )}

            {/* Show form only when data is loaded */}
            {placeDetails && (
              <>
                {/* Photo URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    {...register("photo")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.photo ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter photo URL"
                  />
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.photo.message}
                    </p>
                  )}
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter place description (minimum 15 characters)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Visiting Hours Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visiting Hours
                  </label>
                  <select
                    {...register("visitingHours")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.visitingHours
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {visitingHoursOptions.map((hours) => (
                      <option key={hours} value={hours}>
                        {hours}
                      </option>
                    ))}
                  </select>
                  {errors.visitingHours && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.visitingHours.message}
                    </p>
                  )}
                </div>

                {/* Google Rate Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Rate (0 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register("googleRate", { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.googleRate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.googleRate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.googleRate.message}
                    </p>
                  )}
                </div>

                {/* Preview Current Photo */}
                {watch("photo") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo Preview
                    </label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={watch("photo")}
                        alt="Place preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => handleCloseUpdateModal()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>{" "}
          <button
            type="submit"
            form="update-place-form"
            disabled={!isValid || !placeDetails}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
              isValid && placeDetails
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <SquarePen className="w-4 h-4" />
            {!placeDetails ? "Loading..." : "Update"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
