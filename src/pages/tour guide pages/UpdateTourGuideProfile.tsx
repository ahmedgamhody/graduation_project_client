import { useEffect, useState } from "react";
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
import { updateTourGuideProfile } from "../../utils/api";
import { languages } from "../registerPage";

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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [readonlyData, setReadonlyData] = useState<TourGuideReadonlyData>({
    birthDate: "",
    country: "",
    gender: "",
    photo: "",
  });

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

  useEffect(() => {
    const fetchTourGuideProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Tourguid/Profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        reset({
          name: data.name,
          email: data.email,
          password: data.password || "",
          phone: data.phone,
          allLangues: data.allLangues || [],
        });
        console.log("AllLangues:", data.allLangues);

        // Set selected languages for the UI
        setSelectedLanguages(data.allLangues || []);

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
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-10 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        My Tour Guide Profile
      </h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative">
          {readonlyData.photo ? (
            <img
              src={`https://egypt-guid26.runasp.net/images/${readonlyData.photo}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = avatar;
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center">
              <img src={avatar} alt="Profile" className="w-full rounded-full" />
            </div>
          )}
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
