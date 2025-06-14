/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import {
  TourGuideRegisterSchema,
  TourGuideRegisterFormData,
} from "../../validation/RegisterValidation";
import toast from "react-hot-toast";
import { useAppSelector } from "../../store/hooks";
import { countries, languages } from ".";
import axiosInstance from "../../api/axiosInstance";
import { AppRoutes } from "../../constants/enums";
import { usePlacesNames } from "../../hooks/usePlacesNames";
import { useTripsNames } from "../../hooks/useTripNames";
export default function TourGuideRegisterPage() {
  useTitle("Register - Tour Guide");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);
  const placeDropdownRef = useRef<HTMLDivElement | null>(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        placeDropdownRef.current &&
        !placeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPlaceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(placeSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [placeSearchTerm]);
  const { token } = useAppSelector((state) => state.auth);
  const { placesNames: AllPlacesName, loading: placesLoading } =
    usePlacesNames();
  const { tripsNames: AllTripsName, loading: tripsLoading } = useTripsNames();
  // Filter places based on search term
  const filteredPlaces =
    AllPlacesName?.filter((place) =>
      place.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) || [];
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<TourGuideRegisterFormData>({
    resolver: zodResolver(TourGuideRegisterSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TourGuideRegisterFormData) => {
    const formData = new FormData();

    // Add all form fields
    Object.keys(data).forEach((key) => {
      if (key !== "image" && key !== "Cvfile" && key !== "AllLangues") {
        formData.append(key, (data as any)[key]);
      }
    });

    // Add selected languages
    if (data.AllLangues && Array.isArray(data.AllLangues)) {
      data.AllLangues.forEach((lang) => {
        formData.append("AllLangues", lang);
      });
    }
    // Add files
    if (profileImage) {
      formData.append("image", profileImage);
    }
    if (uploadedCV) {
      formData.append("Cvfile", uploadedCV);
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/Tourguid/CreateAcount", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        toast.success(`Registration successful! Welcome`);
        nav(AppRoutes.CONFIRMED_TOUR_GUIDE_REGISTER);
      } else {
        toast.error("Registration failed. Please check your details.");
      }
    } catch (error: any) {
      toast.error(`Registration failed , ${error?.response?.data?.errors[1]}`);
      if (error?.response?.data?.errors) {
        setErrorMessage(error?.response?.data?.errors[1]);
      }
      console.error("Error registering user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should not exceed 10MB");
        return;
      }

      setProfileImage(file);
      // Update form field for validation
      setValue("image", event.target.files as any);
      // Trigger validation for this field
      await trigger("image");

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageDelete = async () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Clear form field
    setValue("image", undefined as any);
    // Trigger validation for this field
    await trigger("image");
    if (ref.current) {
      ref.current.value = "";
    }
  };

  if (token) return <Navigate to="/" replace />;
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <img
          src="/main_logo.png"
          alt="Register Logo"
          className="mx-auto block w-24 md:w-32 lg:w-28 mb-4"
        />
        <h1 className="text-2xl font-semibold mb-4 text-center text-secondary">
          Register as Tour Guide
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* image upload for tour guide  */}
          <div className="flex flex-col items-center justify-start">
            <div className="relative mb-4">
              {profileImagePreview ? (
                <div className="relative">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    &times;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      ref.current?.click();
                    }}
                    className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-purple-600 transition-colors"
                    title="Edit image"
                  >
                    ✎
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    ref.current?.click();
                  }}
                  className="w-32 h-32 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">Add Photo</p>
                  </div>
                </div>
              )}{" "}
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={ref}
              />
            </div>{" "}
            <p className="text-xs text-gray-500 text-center">
              Click to upload profile image
              <br />
              (Max 10MB)
            </p>
            {errors.image && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.image.message?.toString()}
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <div className="w-full">
              <div className="mb-3">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register("Name")}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.Name && (
                  <p className="text-red-500 text-sm">{errors.Name.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register("Email")}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm">{errors.Email.message}</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("Password")}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    disabled={isSubmitting}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
                {errors.Password && (
                  <p className="text-red-500 text-sm">
                    {errors.Password.message}
                  </p>
                )}
              </div>{" "}
              <div className="mb-3">
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("Gender")}
                  disabled={isSubmitting}
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.Gender && (
                  <p className="text-red-500 text-sm">
                    {errors.Gender.message}
                  </p>
                )}
              </div>{" "}
              <div className="mb-3">
                <label className="block text-gray-700">Trip Name</label>
                <select
                  {...register("TripName")}
                  disabled={isSubmitting || tripsLoading}
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option value="" disabled>
                    {tripsLoading ? "Loading trips..." : "Select a trip type"}
                  </option>
                  {AllTripsName?.map((trip) => (
                    <option key={trip} value={trip}>
                      {trip}
                    </option>
                  ))}
                </select>
                {errors.TripName && (
                  <p className="text-red-500 text-sm">
                    {errors.TripName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              {" "}
              <div className="mb-3">
                <label className="block text-gray-700">Country</label>
                <select
                  {...register("Country")}
                  disabled={isSubmitting}
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  {countries?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.Country && (
                  <p className="text-red-500 text-sm">
                    {errors.Country.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  {...register("Phone")}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.Phone && (
                  <p className="text-red-500 text-sm">{errors.Phone.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Birth Date</label>
                <input
                  type="date"
                  {...register("BirthDate")}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.BirthDate && (
                  <p className="text-red-500 text-sm">
                    {errors.BirthDate.message}
                  </p>
                )}
              </div>{" "}
              <div className="mb-3">
                <label className="block text-gray-700">Place Name</label>{" "}
                <div className="relative" ref={placeDropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedPlace || placeSearchTerm}
                      onChange={(e) => {
                        setPlaceSearchTerm(e.target.value);
                        setSelectedPlace("");
                        setShowPlaceDropdown(true);
                        // Clear the form value when searching
                        setValue("PlaceName", "");
                      }}
                      onFocus={() => setShowPlaceDropdown(true)}
                      placeholder={
                        placesLoading
                          ? "Loading places..."
                          : "Search for a place..."
                      }
                      disabled={isSubmitting || placesLoading}
                      className="w-full px-3 py-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                    />
                    {/* Search/Clear Icon */}
                    <div className="absolute right-3 top-3 text-gray-400">
                      {selectedPlace ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlace("");
                            setPlaceSearchTerm("");
                            setValue("PlaceName", "");
                            setShowPlaceDropdown(false);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          title="Clear selection"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      ) : (
                        <svg
                          className="w-4 h-4 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* Hidden input for form registration */}
                  <input
                    {...register("PlaceName")}
                    type="hidden"
                    value={selectedPlace}
                  />
                  {/* Dropdown list */}
                  {showPlaceDropdown && !placesLoading && (
                    <div className="absolute z-10 w-full bg-white border border-gray-400 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredPlaces.length > 0 ? (
                        <>
                          {filteredPlaces.slice(0, 20).map((place) => (
                            <div
                              key={place}
                              onClick={() => {
                                setSelectedPlace(place);
                                setPlaceSearchTerm("");
                                setShowPlaceDropdown(false);
                                setValue("PlaceName", place);
                                trigger("PlaceName");
                              }}
                              className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <span className="text-sm text-gray-700">
                                {place.length > 50
                                  ? `${place.slice(0, 50)}...`
                                  : place}
                              </span>
                            </div>
                          ))}
                          {filteredPlaces.length > 20 && (
                            <div className="px-3 py-2 text-xs text-gray-500 text-center bg-gray-50">
                              Showing first 20 results. Type to narrow search.
                            </div>
                          )}{" "}
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
                {errors.PlaceName && (
                  <p className="text-red-500 text-sm">
                    {errors.PlaceName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            {/* languages */}
            <div className="mb-3">
              <label className="block text-gray-700 mb-2">Languages</label>{" "}
              <select
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                onChange={async (e) => {
                  const selectedLang = e.target.value;
                  if (
                    selectedLang &&
                    !selectedLanguages.includes(selectedLang)
                  ) {
                    const newLanguages = [...selectedLanguages, selectedLang];
                    setSelectedLanguages(newLanguages);
                    setValue("AllLangues", newLanguages as any);
                    // Trigger validation for this field
                    await trigger("AllLangues");
                  }
                  e.target.value = "";
                }}
                defaultValue=""
                disabled={isSubmitting}
              >
                <option value="" className="hidden">
                  Select a language
                </option>
                {/* {languages.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    disabled={selectedLanguages.includes(lang.code)}
                  >
                    {lang.name}
                  </option>
                ))} */}
                {/* return all languages but not chosen */}
                {languages
                  .filter((lang) => !selectedLanguages.includes(lang.code))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
              </select>
              {/* Selected Languages Display */}
              {selectedLanguages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected Languages:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map((langCode) => {
                      const language = languages.find(
                        (l) => l.code === langCode
                      );
                      return (
                        <div
                          key={langCode}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          <span>{language?.name}</span>
                          <button
                            type="button"
                            onClick={async () => {
                              const newLanguages = selectedLanguages.filter(
                                (l) => l !== langCode
                              );
                              setSelectedLanguages(newLanguages);
                              // Update form field using setValue
                              setValue("AllLangues", newLanguages as any);
                              // Trigger validation for this field
                              await trigger("AllLangues");
                            }}
                            className="text-purple-600 hover:text-purple-800 font-bold"
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {errors.AllLangues && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.AllLangues.message}
                </p>
              )}
            </div>
          </div>
          {/* CV File Upload Section */}
          <div className="my-3">
            <label className="block text-gray-700 mb-2">CV (PDF only)</label>{" "}
            {!uploadedCV ? (
              <input
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedCV(file);
                    // Update form field for validation
                    setValue("Cvfile", e.target.files as any);
                    // Trigger validation for this field
                    await trigger("Cvfile");
                  }
                }}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                ref={cvRef}
              />
            ) : (
              <div className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {uploadedCV.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(uploadedCV.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setUploadedCV(null);
                    setValue("Cvfile", undefined as any);
                    // Trigger validation for this field
                    await trigger("Cvfile");
                    if (cvRef.current) {
                      cvRef.current.value = "";
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-bold text-lg"
                  title="Remove CV"
                >
                  &times;
                </button>
              </div>
            )}
            {errors.Cvfile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Cvfile.message?.toString()}
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting || !isValid}
            type="submit"
            className={`w-full  bg-primary text-white py-2 rounded-md hover:bg-secondary transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                Registering...
              </>
            ) : (
              "Register as Tour Guide"
            )}
          </button>
        </form>
        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
