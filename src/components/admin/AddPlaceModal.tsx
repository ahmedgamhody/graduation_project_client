/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { CirclePlus, HousePlus, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPlaceFormData,
  AddPlaceSchema,
} from "../../validation/AdminPlaceValidation";
import {
  visitingHoursOptions,
  allGovernorates,
  allTypesOfTourism,
} from "../../pages/admin dashboard";
import { useState } from "react";
import { queryClient } from "../../main";
import { addPlaceByAdmin } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";

export default function AddPlaceModal({
  handleCloseAddPlaceModal,
}: {
  handleCloseAddPlaceModal: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [selectedTypesOfTourism, setSelectedTypesOfTourism] = useState<
    string[]
  >([allTypesOfTourism[0]]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
  } = useForm<AddPlaceFormData>({
    resolver: zodResolver(AddPlaceSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      photo: "",
      description: "",
      visitingHours: visitingHoursOptions[0],
      googleRate: 0,
      location: "",
      governmentName: allGovernorates[0],
      typeOfTourism: [allTypesOfTourism[0]],
    },
  });
  const onSubmit = async (data: AddPlaceFormData) => {
    try {
      await addPlaceByAdmin(token, data);
    } catch (error) {
      console.error("Error adding place:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["AllPlaces"] });
      handleCloseAddPlaceModal();
    }
  };

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Adding place...</p>
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
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HousePlus className="w-6 h-6 text-blue-600" />
            </div>{" "}
            <div>
              <h3 className="text-xl font-bold text-gray-900">Add Place</h3>
              <p className="text-sm text-gray-600 mt-1">
                Fields marked with * are required
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCloseAddPlaceModal()}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>{" "}
        {/* Modal Content */}
        <form
          id="add-place-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter place name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Photo URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo URL *
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
            </div>{" "}
            {/* Location URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location URL *
              </label>
              <input
                type="url"
                {...register("location")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter Google Maps search URL for the place location
              </p>
            </div>
            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
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
            {/* Government Name Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Governorate *
              </label>
              <select
                {...register("governmentName")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.governmentName ? "border-red-500" : "border-gray-300"
                }`}
              >
                {allGovernorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              {errors.governmentName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.governmentName.message}
                </p>
              )}
            </div>{" "}
            {/* Type of Tourism Multi-Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Tourism *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.typeOfTourism ? "border-red-500" : "border-gray-300"
                }`}
                onChange={async (e) => {
                  const selectedType = e.target.value;
                  if (
                    selectedType &&
                    !selectedTypesOfTourism.includes(selectedType)
                  ) {
                    const newTypes = [...selectedTypesOfTourism, selectedType];
                    setSelectedTypesOfTourism(newTypes);
                    setValue("typeOfTourism", newTypes as any);
                  }
                  e.target.value = "";
                }}
                defaultValue=""
              >
                <option value="" className="hidden">
                  Select type of tourism
                </option>
                {allTypesOfTourism
                  .filter((type) => !selectedTypesOfTourism.includes(type))
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>

              {/* Selected Types Display */}
              {selectedTypesOfTourism.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-2">Selected Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypesOfTourism.map((type) => (
                      <div
                        key={type}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        <span>{type}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const newTypes = selectedTypesOfTourism.filter(
                              (t) => t !== type
                            );
                            setSelectedTypesOfTourism(newTypes);
                            setValue("typeOfTourism", newTypes as any);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.typeOfTourism && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.typeOfTourism.message}
                </p>
              )}
            </div>
            {/* Visiting Hours Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visiting Hours *
              </label>
              <select
                {...register("visitingHours")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.visitingHours ? "border-red-500" : "border-gray-300"
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
                Google Rate (0 - 5) *
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
                placeholder="Enter rating (0-5)"
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
          </div>
        </form>{" "}
        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => handleCloseAddPlaceModal()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={isSubmitting}
          >
            Close
          </button>
          <button
            type="submit"
            form="add-place-form"
            disabled={!isValid || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
              isValid && !isSubmitting
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CirclePlus className="w-4 h-4" />
            {isSubmitting ? "Adding..." : "Add Place"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
