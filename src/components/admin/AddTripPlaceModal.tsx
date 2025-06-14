import { motion } from "framer-motion";
import { CirclePlus, LandPlot, Search, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddTripSchema,
  AddTripFormData,
} from "../../validation/AdminTripValidation";
import { allProgramsNames } from "../../pages/admin dashboard";
import { usePlacesNames } from "../../hooks/usePlacesNames";
import { useAppSelector } from "../../store/hooks";
import { addTripByAdmin } from "../../utils/api";
import { queryClient } from "../../main";

export default function AddTripPlaceModal({
  handleCloseAddTripPlaceModal,
}: {
  handleCloseAddTripPlaceModal: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const placeDropdownRef = useRef<HTMLDivElement | null>(null);

  const { placesNames: AllPlacesName, loading: placesLoading } =
    usePlacesNames();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<AddTripFormData>({
    resolver: zodResolver(AddTripSchema),
    mode: "onChange",
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(placeSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [placeSearchTerm]);

  // Filter places based on search term and exclude already selected places
  const filteredPlaces =
    AllPlacesName?.filter(
      (place: string) =>
        place.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
        !selectedPlaces.includes(place)
    ) || [];

  const handlePlaceSelect = async (place: string) => {
    const newSelectedPlaces = [...selectedPlaces, place];
    setSelectedPlaces(newSelectedPlaces);
    setValue("tripsPlaces", newSelectedPlaces);
    await trigger("tripsPlaces");
    setPlaceSearchTerm("");
    setShowPlaceDropdown(false);
  };

  const handlePlaceRemove = async (placeToRemove: string) => {
    const newSelectedPlaces = selectedPlaces.filter(
      (place) => place !== placeToRemove
    );
    setSelectedPlaces(newSelectedPlaces);
    setValue("tripsPlaces", newSelectedPlaces);
    await trigger("tripsPlaces");
  };

  const onSubmit = async (data: AddTripFormData) => {
    try {
      setIsSubmitting(true);
      const requestData = {
        ...data,
        tripsPlaces: selectedPlaces,
      };

      await addTripByAdmin(token, requestData);
    } catch (error: unknown) {
      console.error("Error adding trip:", error);
    } finally {
      setIsSubmitting(false);
      await queryClient.invalidateQueries({ queryKey: ["TripsPlaces Admin"] });
      handleCloseAddTripPlaceModal();
    }
  };

  const handleClose = () => {
    reset();
    setSelectedPlaces([]);
    setPlaceSearchTerm("");
    setShowPlaceDropdown(false);
    handleCloseAddTripPlaceModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LandPlot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Add Trip Place
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2"
              disabled={isSubmitting}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form
            id="addTripPlaceForm"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1  space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trip Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter trip name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name *
                </label>
                <select
                  {...register("programName")}
                  disabled={isSubmitting}
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a program
                  </option>
                  {allProgramsNames.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
                {errors.programName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.programName.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Days *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("days", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of days"
                />
                {errors.days && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.days.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description")}
                disabled={isSubmitting}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter trip description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Trip Places */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Places *
              </label>

              {/* Search Input */}
              <div className="relative" ref={placeDropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={placeSearchTerm}
                    onChange={(e) => {
                      setPlaceSearchTerm(e.target.value);
                      setShowPlaceDropdown(true);
                    }}
                    onFocus={() => setShowPlaceDropdown(true)}
                    placeholder={
                      placesLoading
                        ? "Loading places..."
                        : "Search and select places..."
                    }
                    disabled={isSubmitting || placesLoading}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>

                {/* Hidden input for form registration */}
                <input
                  {...register("tripsPlaces")}
                  type="hidden"
                  value={selectedPlaces}
                />

                {/* Dropdown list */}
                {showPlaceDropdown && !placesLoading && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {filteredPlaces.length > 0 ? (
                      <>
                        {filteredPlaces.slice(0, 20).map((place: string) => (
                          <button
                            key={place}
                            type="button"
                            onClick={() => handlePlaceSelect(place)}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-sm"
                          >
                            {place}
                          </button>
                        ))}
                        {filteredPlaces.length > 20 && (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center border-t border-gray-200">
                            And {filteredPlaces.length - 20} more places...
                          </div>
                        )}
                      </>
                    ) : debouncedSearchTerm ? (
                      <div className="px-3 py-2 text-sm text-gray-500 text-center">
                        No places found matching "{debouncedSearchTerm}"
                      </div>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500 text-center">
                        Start typing to search for places...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Places Display */}
              {selectedPlaces.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected Places ({selectedPlaces.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlaces.map((place: string) => (
                      <span
                        key={place}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {place}
                        <button
                          type="button"
                          onClick={() => handlePlaceRemove(place)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          disabled={isSubmitting}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.tripsPlaces && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tripsPlaces.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close
          </button>
          <button
            type="submit"
            form="addTripPlaceForm"
            disabled={isSubmitting || !isValid || selectedPlaces.length === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Adding Trip...
              </>
            ) : (
              <>
                <CirclePlus className="w-4 h-4" />
                Add Trip Place
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
