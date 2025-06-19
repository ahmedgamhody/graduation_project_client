import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import axiosInstance from "../../api/axiosInstance";
import avatar from "../../../public/avatar.png";
import {
  TourGuideProfileFormData,
  tourGuideProfileSchema,
} from "../../validation/ProfileValidation";
import {
  deletePhoto,
  updateTourGuideProfile,
  uploadPhoto,
} from "../../utils/api";
import { languages } from "../registerPage";
import toast from "react-hot-toast";

interface TourGuideReadonlyData {
  country: string;
  birthDate: string;
  gender: string;
  photo?: string;
}

export default function UpdateTourGuideProfile() {
  useTitle("Profile - Tour Guide Information");
  const [isNeedUpdate, setIsNeedUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [readonlyData, setReadonlyData] = useState<TourGuideReadonlyData>({
    birthDate: "",
    country: "",
    gender: "",
    photo: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const ref = useRef<HTMLInputElement | null>(null);

  const nav = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<TourGuideProfileFormData>({
    resolver: zodResolver(tourGuideProfileSchema),
  });
  const handleImageDelete = async () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setReadonlyData((prev) => ({
      ...prev,
      photo: "",
    }));
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("file:", file);
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
      setIsNeedUpdate(true);
      setIsAvatar(false);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const fetchTourGuideProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Tourguid/Profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("Fetched Tour Guide Profile Data:", data);
        reset({
          name: data.name,
          email: data.email,
          password: data.password || "",
          phone: data.phone,
          allLangues: data.allLangues || [],
        });

        // Set selected languages for the UI
        setSelectedLanguages(data.allLangues || []);
        setProfileImagePreview(
          data.photo
            ? `https://egypt-guid26.runasp.net/images/${data.photo}`
            : avatar
        );
        setIsAvatar(data.photo === null ? true : false);
        setReadonlyData({
          country: data.country,
          birthDate: data.birthDate,
          gender: data.gender,
          photo: data.photo,
        });
        console.log(data);
      } catch (err) {
        console.error("Error fetching tour guide profile:", err);
      }
    };

    if (token) {
      fetchTourGuideProfile();
    }
  }, [token, reset]);

  const onSubmit = async (data: TourGuideProfileFormData) => {
    if (isNeedUpdate) {
      setIsLoading(true);
      if (profileImagePreview && profileImage) {
        await uploadPhoto(token, profileImage);
      }
      if (!profileImagePreview && !profileImage) {
        await deletePhoto(token);
      }
      try {
        await updateTourGuideProfile(token, data);
        nav("/");
      } catch (error) {
        console.error("Failed to update profile:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsNeedUpdate(true);
    }
  };
  console.log("isAvatar:", isAvatar);
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-10 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        My Tour Guide Profile
      </h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative mb-4">
          {" "}
          {profileImagePreview ? (
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
              />
              {isNeedUpdate && (
                <>
                  {!isAvatar && (
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  )}

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
                </>
              )}
            </div>
          ) : readonlyData.photo ? (
            <div className="relative">
              <img
                src={`https://egypt-guid26.runasp.net/images/${readonlyData.photo}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = avatar;
                }}
              />
              {isNeedUpdate && (
                <>
                  {/* زر الحذف يظهر فقط إذا كانت هناك صورة حقيقية */}
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
                    title="Change image"
                  >
                    ✎
                  </button>
                </>
              )}
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
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { field: "name", label: "Name", type: "text" },
            { field: "email", label: "Email", type: "email" },
            { field: "password", label: "Password", type: "password" },
            { field: "phone", label: "Phone", type: "tel" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                disabled={!isNeedUpdate}
                type={type}
                {...register(field as keyof TourGuideProfileFormData)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
              />
              {errors[field as keyof TourGuideProfileFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field as keyof TourGuideProfileFormData]?.message}
                </p>
              )}
            </div>
          ))}
        </div>{" "}
        {/* Languages Field */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Languages
          </label>
          <select
            disabled={!isNeedUpdate}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
            onChange={async (e) => {
              const selectedLang = e.target.value;
              if (selectedLang && !selectedLanguages.includes(selectedLang)) {
                const newLanguages = [...selectedLanguages, selectedLang];
                setSelectedLanguages(newLanguages);
                setValue("allLangues", newLanguages);
                // Trigger validation for this field
                await trigger("allLangues");
              }
              e.target.value = "";
            }}
            defaultValue=""
          >
            <option value="" className="hidden">
              Select a language
            </option>
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
              <p className="text-sm text-gray-600 mb-2">Selected Languages:</p>
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((langCode) => {
                  const language = languages.find((l) => l.code === langCode);
                  return (
                    <div
                      key={langCode}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                        isNeedUpdate
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      <span>{language?.name}</span>
                      {isNeedUpdate && (
                        <button
                          type="button"
                          onClick={async () => {
                            const newLanguages = selectedLanguages.filter(
                              (l) => l !== langCode
                            );
                            setSelectedLanguages(newLanguages);
                            // Update form field using setValue
                            setValue("allLangues", newLanguages);
                            // Trigger validation for this field
                            await trigger("allLangues");
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.allLangues && (
            <p className="text-red-500 text-sm mt-1">
              {errors.allLangues?.message}
            </p>
          )}
        </div>
        {/* Personal Information (Readonly) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Country", value: readonlyData.country },
              {
                label: "Birth Date",
                value: readonlyData.birthDate
                  ? new Date(readonlyData.birthDate).toLocaleDateString()
                  : "Not provided",
              },
              { label: "Gender", value: readonlyData.gender },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block font-medium text-gray-700">
                  {label}
                </label>
                <input
                  value={value || "Not provided"}
                  readOnly
                  disabled
                  className="w-full mt-1 px-3 py-2 border border-gray-300 bg-gray-100 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          {!isNeedUpdate && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Edit Profile
            </button>
          )}

          {isNeedUpdate && (
            <>
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => setIsNeedUpdate(false)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
